import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { SessionRequest } from 'supertokens-node/framework/express';
import supertokens from 'supertokens-node';
import connectToDatabase from '../config/db';
import { UserModel } from '../models/user';
import ProductModel from '../models/Product';
import upload from '../config/s3Config'; 
import OrderModel from '../models/Order';
import Stripe from 'stripe';
import { sendDeliveryNotificationEmail } from '../emails/mailer';
import { getWebsiteDomain } from '../middleware/auth';
import { logMemoryUsage } from '../database/helper';
import { Request } from 'express'; // Import Request from express
import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs';
import path from 'path';

const express = require('express');

export const router = express.Router();
connectToDatabase();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 'apiVersion': '2024-06-20' });

router.get('/user/:userId', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  console.log(`Received request to fetch user info for user ID: ${userId}`);

  try {
    const userInfo = await supertokens.getUser(userId);
    const user = await UserModel.findOne({ supertokens_id: userId });

    if (user) {
      res.json({
        ...user.toObject(),
        supertokensInfo: userInfo,
      });
      console.log(`User fetched successfully: ${userId}`);
      logMemoryUsage();
    } else {
      console.warn(`User not found: ${userId}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  console.log(`Received request to update settings for user ID: ${userId}`);

  try {
    const { firstName, lastName, deliveryLocation, customLocation } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { supertokens_id: userId },
      { firstName, lastName, deliveryLocation, customLocation },
      { new: true }
    );

    if (updatedUser) {
      console.log(`User settings updated successfully: ${userId}`);
      res.json(updatedUser);
      logMemoryUsage();
    } else {
      console.warn(`User not found for update: ${userId}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(`Error updating user settings for ${userId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Extend the SessionRequest type
interface ExtendedSessionRequest extends SessionRequest {
  files?: Request['files'];
}

router.post('/products', verifySession(), upload.array('images', 5), async (req: ExtendedSessionRequest, res) => {
  const userId = req.session!.getUserId();
  const { name, description, price, category, size, ticketLink } = req.body;
  console.log(`Received request to create a product for user ID: ${userId}, Product Name: ${name}`);

  try {
    if (!req.files || req.files.length === 0) {
      console.error(`User ${userId} attempted to create a product without uploading files.`);
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = [];

    for (const file of req.files as Express.Multer.File[]) {
      const fileType = file.mimetype;
        imageUrls.push({
          image: (file as any).location,
          id: file.originalname,
        });
    }

    const newProduct = new ProductModel({
      user: userId,
      name,
      description,
      price,
      category,
      size,
      ticketLink,
      images: imageUrls,
      approvedForSale: 'pending',
    });

    const savedProduct = await newProduct.save();
    console.log(`Product created successfully for user ${userId}: ${savedProduct._id}`);
    res.status(201).json(savedProduct);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error creating product for user ${userId}:`, error);
    res.status(500).json({ message: 'Failed to create product', error });
  }
});

router.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to fetch product with ID: ${id}`);

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      console.warn(`Product not found: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
    console.log(`Product fetched successfully: ${id}`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error retrieving product ${id}:`, error);
    res.status(500).json({ message: 'Error retrieving product', error });
  }
});

router.get('/products/approved', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;
  console.log(`Received request for approved products, Page: ${page}, Limit: ${limit}`);

  try {
    const approvedProducts = await ProductModel.find({ approvedForSale: 'approved' })
      .sort({ createdAt: -1 }) // this is not working, not sure why
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments({ approvedForSale: 'approved' });

    res.status(200).json({
      products: approvedProducts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
    console.log(`Approved products fetched successfully: ${approvedProducts.length} items`);
    logMemoryUsage();
  } catch (error) {
    console.error('Error fetching approved products:', error);
    res.status(500).json({ message: 'Error retrieving approved products', error });
  }
});

// Route to get products for seller dashboard
router.get('/productslisted/:userId', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  console.log(`Received request for products listed by user ID: ${userId}`);

  try {
    const products = await ProductModel.find({ user: userId });
    res.json(products);
    console.log(`Products listed fetched successfully for user ${userId}: ${products.length} items`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error fetching products for user ${userId}:`, error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

router.put('/products/edit/:id', verifySession(), upload.array('images', 5), async (req: ExtendedSessionRequest, res) => {
  const { id } = req.params;
  const { name, description, price, category, size, ticketLink } = req.body;
  console.log(`Received request to update product ID: ${id}`);

  try {
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      console.warn(`Product not found for update: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.category = category;
    existingProduct.size = size;
    existingProduct.ticketLink = ticketLink;
    existingProduct.approvedForSale = 'pending';

    // Handle new images and replace existing images
    if (req.files && req.files.length as number > 0) {
      const newImageUrls = (req.files as Express.MulterS3.File[]).map((file) => ({
        image: file.location,
        id: file.originalname,
      }));
      existingProduct.images = newImageUrls;
    } else if (req.body.images) {
      existingProduct.images = Array.isArray(req.body.images)
        ? req.body.images.map((url: string) => ({ image: url, id: '' }))
        : [{ image: req.body.images, id: '' }];
    }

    const updatedProduct = await existingProduct.save();
    console.log(`Product updated successfully: ${updatedProduct._id}`);
    res.status(200).json(updatedProduct);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Create a checkout session
router.post('/create-checkout-session', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  const { items } = req.body;
  console.log(`Received request to create checkout session for user ID: ${userId}`);

  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error(`No items provided for checkout session by user ${userId}`);
    return res.status(400).json({ error: 'No items provided' });
  }

  try {
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.description,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${getWebsiteDomain()}/orders?clear=true`,
      cancel_url: `${getWebsiteDomain()}/cart`,
      client_reference_id: userId
    });

    res.json({ id: session.id, url: session.url });
    console.log(`Checkout session created successfully for user ${userId}`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error creating checkout session for user ${userId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(`Received request to fetch order ID: ${orderId}`);

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      console.warn(`Order not found: ${orderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
    console.log(`Order fetched successfully: ${orderId}`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    res.status(500).json({ message: 'Error retrieving order', error });
  }
});

router.get('/myorders/:userId', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  console.log(`Received request for orders of user ID: ${userId}`);

  try {
    const orders = await OrderModel.find({ user: userId });
    res.status(200).json(orders);
    console.log(`Orders fetched successfully for user ${userId}: ${orders.length} items`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/get-order-id', verifySession(), async (request: SessionRequest, response) => {
  const session = request.session;

  try {
    const sessionData = await session!.getSessionDataFromDatabase();
    const orderId = sessionData.orderId;

    if (orderId) {
      console.log(`Order ID fetched from session: ${orderId}`);
      return response.json({ orderId });
    } else {
      console.warn(`Order ID not found in session for user ${request.session!.getUserId()}`);
      return response.status(404).json({ message: 'Order ID not found in session.' });
    }
  } catch (error) {
    console.error(`Error fetching order ID from session:`, error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Route to verify user in the db after email link opened
router.post('/verify-user', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.error('User ID is required for verification');
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await UserModel.findOneAndUpdate(
      { supertokens_id: userId },
      { verified: true },
      { new: true }
    );

    if (!user) {
      console.warn(`User not found for verification: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User verified successfully: ${userId}`);
    return res.status(200).json({ message: 'User verified successfully', user });
  } catch (error) {
    console.error(`Error verifying user ${userId}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/deliverorder/:orderid', verifySession(), async (req: SessionRequest, res) => {
  const { orderid } = req.params;
  console.log(`Received request to mark order ID as delivered: ${orderid}`);

  try {
    const order = await OrderModel.findById(orderid);
    if (!order) {
      console.warn(`Order not found for delivery: ${orderid}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = await ProductModel.findById(order.products[0].productId);
    if (!product) {
      console.warn(`Product not found for order ${orderid}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    product.approvedForSale = 'delivered';
    await product.save();
    console.log(`Product marked as delivered: ${product._id}`);

    const user = await UserModel.findOne({ supertokens_id: req.session!.getUserId() });
    if (!user || !user.stripe_account_id) {
      console.warn(`Seller account not found for user ${req.session!.getUserId()}`);
      return res.status(400).json({ message: 'Seller account not found' });
    }

    order.status = 'Delivered';
    await order.save();
    await sendDeliveryNotificationEmail(orderid);

    // Schedule payout after 48 hours
    setTimeout(async () => {
      try {
        const amountToPay = (0.97 * product.price - 0.30) * 0.9 * 100;

        await stripe.transfers.create({
          amount: amountToPay,
          currency: 'usd',
          destination: user.stripe_account_id!,
        });

        console.log(`Payout processed for order ${orderid}`);
      } catch (payoutError) {
        console.error(`Error processing payout for order ${orderid}:`, payoutError);
      }
    }, 1000);

    res.status(200).json({ message: 'Product marked as delivered and payout processed' });
    logMemoryUsage();
  } catch (error) {
    console.error(`Error marking product as delivered for order ${orderid}:`, error);
    res.status(500).json({ message: 'Error marking product as delivered and processing payout' });
  }
});

router.post('/update_user_stripe_id', verifySession(), async (req, res) => {
  const { userId, stripeId } = req.body;
  console.log(`Received request to update Stripe ID for user ID: ${userId}`);

  try {
    const user = await UserModel.findByIdAndUpdate(userId, { stripe_account_id: stripeId });
    res.json(user);
    console.log(`User Stripe ID updated successfully: ${userId}`);
    logMemoryUsage();
  } catch (error) {
    console.error(`Error updating Stripe ID for user ${userId}:`, error);
    res.status(500).json({ message: 'Error updating user Stripe ID' });
  }
});

router.get("/protected-route", verifySession(), (req, res) => {
  res.send("This is a protected route");
});

// Route to get an order by product ID
router.get('/order-by-product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
      const order = await OrderModel.findOne({ 'products.productId': productId });

      if (!order) {
          return res.status(404).json({ error: 'Order not found for the given product ID' });
      }

      res.json(order);
  } catch (error) {
      console.error('Error fetching order by product ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/user/update-fee-preference', verifySession(), async (req: SessionRequest, res) => {
  const userId = req.session!.getUserId();
  const { agora_fee } = req.body;

  if (typeof agora_fee !== 'boolean') {
    return res.status(400).json({ error: 'Invalid fee preference value' });
  }

  try {
    const user = await UserModel.findOneAndUpdate(
      { supertokens_id: userId },
      { agora_fee },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User fee preference updated successfully: ${userId}`);
    res.status(200).json({ message: 'Fee preference updated successfully', user });
  } catch (error) {
    console.error(`Error updating fee preference for user ${userId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;