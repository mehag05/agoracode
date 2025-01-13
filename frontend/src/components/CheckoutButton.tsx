import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from './ui/button';
import axios from 'axios';
import { FetchUser } from '../utils/fetchUser';
import { IUser } from '../schema/user';
import { IProduct } from '../schema/Product';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const CheckoutButton = ({ items }: { items: any[] }) => {
    const { user, loading, error }: { user: IUser, loading: boolean, error: any } = FetchUser();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleCheckout = async () => {
        // Check if there are multiple items in the cart
        if (items.length > 1) {
            window.alert('You can only check out one item at a time. Happy Shopping!');
            return; // Exit the function
        }

        // Check if the user is logged in
        if (!user) {
            // Redirect to the sign-in page if not logged in
            navigate('/auth/signin');
            window.alert('Please sign in to checkout!');
            return; // Exit the function
        }

        const stripe = await stripePromise;
        console.log('Items:', items);

        const itemsToCheckout = items!.map((item: any) => ({
            name: item.product.name,
            image: item.product.images[0].image,
            description: item.product._id,
            price: item.product.price * 100, // Ensure this is in cents
            quantity: 1, // Assuming one of each product
        }));

        console.log('Items to send:', itemsToCheckout); // Log the items being sent
        console.log('User ID:', user.supertokens_id); // Log the user ID to check its value

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/create-checkout-session`, {
                items: itemsToCheckout,
                user: user.supertokens_id, // Ensure user is included
            });

            const session = response.data; // Capture the response data

            // Check if session is defined and has an id
            if (session && session.id) {
                const result = await stripe!.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    console.error(result.error.message);
                }
            } else {
                console.error('Session ID not returned or session is undefined', session);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to create checkout session:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <Button variant='bigpurple' onClick={handleCheckout}>
            Checkout
        </Button>
    );
}

export default CheckoutButton;