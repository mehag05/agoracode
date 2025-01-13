import { DeliveryNotificationEmailHtml, DeliveryNotificationEmailSubject } from '../emails/DeliveredEmail';
import { ReceiptEmailHtml, ReceiptEmailSubject } from '../emails/ReceiptEmail';
import { YourProductOrderedEmailHtml, YourProductOrderedEmailSubject } from '../emails/YourProductOrdered';
import { IUser, UserModel } from '../models/user';
import OrderModel from '../models/Order';
import ProductModel, { IProduct } from '../models/Product';

const smtpSettings = {
    host: 'smtp.resend.com', 
    port: 587, // Use 587 for STARTTLS
    secure: false, // Set to false for non-SSL connections
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
    },
};

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(smtpSettings as any);

export const sendDeliveryNotificationEmail = async (orderId: string) => {
    const order = await OrderModel.findById(orderId);

    if (!order) {
        throw new Error('Order not found');
    }

    const productss = await ProductModel.findById(order.products[0].productId);
    if (!productss) {
        throw new Error('Product not found');
    }

    const seller = await UserModel.findOne({ supertokens_id: productss.user }) as IUser;
    const buyer = await UserModel.findOne({ supertokens_id: order.user }) as IUser;

    const mailOptions = {
        from: 'Agora <support@shopatagora.com>',    
        to: buyer.email, // Send to the buyer's email
        subject: DeliveryNotificationEmailSubject,
        html: DeliveryNotificationEmailHtml({
            email: buyer.email,
            date: new Date(),
            orderId: order._id as string,
            products: order.products.map((productId) => ({
                name: productss.name,
                image: productss.images[0].image,
                price: productss.price,
                description: productss.description ?? undefined,
            })),
            deliveryLocation: 
                (buyer.deliveryLocation === 'Dorm Room' || buyer.deliveryLocation === 'Off campus residence') 
                    ? buyer.customLocation as string
                    : buyer.deliveryLocation as string,
        }),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Delivery Notification Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error occurred while sending Delivery Notification Email:', error);
    }
};

export const sendReceiptEmail = async (orderId: string) => {
    const order = await OrderModel.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const products = await ProductModel.find({ _id: { $in: order.products.map(p => p.productId) } });
    if (products.length === 0) {
        throw new Error('No products found for the order');
    }

    const buyer = await UserModel.findOne({supertokens_id: order.user}) as IUser;

    const mailOptions = {
        from: 'Agora <support@shopatagora.com>',    
        to: buyer.email, // Send to the buyer's email
        subject: ReceiptEmailSubject,
        html: ReceiptEmailHtml({
            email: buyer.email,
            date: new Date(),
            orderId: order._id as string,
            products: products.map(product => ({
                name: product.name,
                image: product.images[0].image,
                price: product.price,
                description: product.description ?? undefined,
            })),
        }),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Receipt Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error occurred while sending Receipt Email:', error);
    }
};
export const sendYourProductOrderedEmail = async (orderId: string) => {
    const order = await OrderModel.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const products = await ProductModel.find({ _id: { $in: order.products.map(p => p.productId) } });
    console.log('Product(s) found:', products);
    if (products.length === 0) {
        throw new Error('No products found for the order');
    }
    const buyer = await UserModel.findOne({ supertokens_id: order.user }) as IUser;
    console.log('Buyer found:', buyer);
    const seller = await UserModel.findOne({ supertokens_id: products[0].user }) as IUser;
    console.log('Seller found:', seller);

    const mailOptions = {
        from: 'Agora <support@shopatagora.com>', 
        to: seller.email, // Send to the seller's email
        subject: YourProductOrderedEmailSubject,
        html: YourProductOrderedEmailHtml(seller, products[0], buyer),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Your Product Ordered Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error occurred while sending Your Product Ordered Email:', error);
    }
};


