import ProductModel from '../models/Product';
import OrderModel, { IOrder } from '../models/Order';
import { UserModel } from '../models/user';
import { sendReceiptEmail, sendYourProductOrderedEmail } from '../emails/mailer';
import stripe from '../config/stripe';

const express = require('express');

const router = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post('/', async (request: any, response: any) => {
    const sig = request.headers['stripe-signature'];

    console.log('Raw body:', request.body.toString());

    let event;

    try {
        // Ensure the raw body is passed as a Buffer
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log('Webhook event constructed:', event);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err);
        console.error('Received payload:', request.body.toString('utf8'));
        console.error('Received signature:', sig);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Event type:', event.type); // Log the event type
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const sessionData = event.data.object as { id: string }; // Cast to a specific type
                console.log('Handling checkout session:', sessionData.id); // Log the session ID
                const order: IOrder = await handleCheckoutSession(sessionData);
                console.log('Order:', order); // Log the order
                // Send emails after order creation
                if (order) {
                    console.log(order)
                    try {
                        await sendYourProductOrderedEmail(order._id as string);
                        await sendReceiptEmail(order._id as string);
                    } catch (emailError) {
                        console.error('Error sending emails:', emailError);
                        throw new Error('Error sending confirmation emails');
                    }
                }

                response.status(200).send('Order processed successfully'); // Send response once
                break;

            case 'payment_intent.payment_failed':
                console.log('PaymentIntent failed.');
                // Optionally notify the user via email
                break;

            case 'checkout.session.async_payment_failed':
                console.log('Async payment failed for checkout session.');
                // Optionally notify the user via email
                break;
            case 'checkout.session.expired':
                console.log('Checkout session expired.');
                // redirect to cart
                response.redirect('/cart');
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
                response.status(200).send(); // Acknowledge receipt of the event
        }
    } catch (error) {
        console.error('Error handling event:', error);
        if (!response.headersSent) {
            response.status(500).send('Internal Server Error'); // Send error response if not already sent
        }
    }
});

async function handleCheckoutSession(session: any): Promise<IOrder> {
    try {
        console.log('Fetching line items for session ID:', session.id); // Log the session ID being processed
        
        // Attempt to fetch line items
        let lineItems;
        try {
            lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            console.log('Line items:', lineItems.data); // Log line items
        } catch (error) {
            console.error('Error fetching line items:', error); // Log any errors from the Stripe API
            return null; // Exit the function if there's an error
        }

        console.log('Number of line items:', lineItems.data.length); // Log the number of line items

        const taxAmount = session.total_details?.amount_tax || 0; // Use optional chaining and default to 0 if undefined

        for (const item of lineItems.data) {
            console.log('Processing item:', item); // Log each item being processed

            // Check if item.price.product is defined
            if (item.price) {
                const productId = item.description; // Access the product ID from metadata
                console.log('Product ID:', productId); // Log the product ID

                try {
                    const Product = await ProductModel.findById(productId); //Mongo
                    console.log('Found product:', Product); // Log the found product

                    if (Product && Product.approvedForSale === 'approved') {
                        // Update the product to sold
                        await ProductModel.findByIdAndUpdate(productId, { approvedForSale: 'sold' });
                        console.log('Product updated to sold:', productId); // Log the update
                        const userid = Product.user;
                        const seller = await UserModel.findOne({ supertokens_id: userid });
                        const stripe_account_id = seller!.stripe_account_id; //need to add this to db when user is created
                        console.log('Stripe account ID:', stripe_account_id);

                        // Calculate Agora fee if seller's preference is false
                        const agoraFee = seller!.agora_fee ? 0 : Product.price * 0.1; // Assuming a 10% fee
                        const totalPrice = item.amount_total + agoraFee;

                        // Create an order including the tax amount and Agora fee
                        const order = new OrderModel({
                            user: session.client_reference_id,
                            products: [{
                                productId: productId,
                                name: Product.name,
                                price: Product.price,
                                image: Product.images[0].image,
                            }],
                            _isPaid: true,
                            total_price: totalPrice, // Include Agora fee in total price
                            status: 'On the Way!',
                            sellerid: stripe_account_id, 
                        });

                        await order.save();
                        console.log('Order created:', order); // Log the created order
                        return order;
                    } else {
                        console.warn('Product not found or not approved for sale:', productId);
                    }
                } catch (error) {
                    console.error('Error finding or updating product:', error); // Log any errors from database operations
                }
            } else {
                console.error('Product information is not available for this line item:', item);
            }
        }

        console.log('Finished processing line items.'); // Log after processing all line items
    } catch (error) {
        console.error('Error handling checkout session:', error); // Log any errors that occur
    }
}

export default router;