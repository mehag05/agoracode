import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'; // Added Navigate import
import { IProduct } from '../schema/Product';
import { IUser } from '../schema/user';
import { PRODUCT_CATEGORIES } from '../config/config';
import { formatPrice } from '../lib/utils';
import PaymentStatus from '../components/PaymentStatus';
import { FetchUser } from '../utils/fetchUser';
import { IOrder } from '../schema/Order';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import Spinner from 'components/Spinner';

const ThankYouPage = () => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user, error: userError } = FetchUser(); // Destructure the returned object
    const { clearCart } = useCart(); // Use the hook here

    useEffect(() => {
        // Clear the cart when the component mounts
        clearCart();
        console.log('Cleared cart');
    }, [clearCart]); // Dependency array includes clearCart

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-order-id`);

                if (!response.data) {
                    throw new Error('Failed to fetch order ID');
                }

                const data = await response.data;
                setOrderId(data.orderId);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchOrderId();
    }, []);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderId}`);
            if (!response.data) {
                throw new Error('Failed to fetch order details');
            }
            const orderData = await response.data;
            setOrder(orderData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController instance
        if (orderId) {
            fetchOrderDetails(orderId);
        }

        return () => {
            abortController.abort(); // Cleanup function to abort the request
        };
    }, [orderId]);

    if (loading) return <div><Spinner/></div>;
    if (error) return <div>Error: {error}</div>;
    if (!order) return <div>No order found.</div>;
    if (userError) return <Navigate to="auth/signin" />; // Use Navigate for redirection

    const orderUserId = typeof order.user === 'string' ? order.user : order.user;

    if (orderUserId !== user?.supertokens_id) {
        return <Navigate to="auth/signin" />; // Use Navigate for redirection
    }

    const products = order.products as unknown as IProduct[];

    const orderTotal = products.reduce((total, product) => {
        return total + product.price;
    }, 0);

    return (
        <main className='relative lg:min-h-full'>
            <div className='hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
                <video
                    autoPlay
                    loop
                    muted
                    className='h-full w-full object-cover object-center'
                >
                    <source src='/order-confirmed.mp4' type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div>
                <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
                    <div className='lg:col-start-2'>
                        <p className='text-sm font-medium text-pink'>
                            Order successful
                        </p>
                        <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                            Thanks for ordering
                        </h1>
                        {order._isPaid ? (
                            <p className='mt-2 text-base text-muted-foreground'>
                                Your order was processed and the seller has been notified. We&apos;ve sent
                                your receipt and order details to{' '}
                                {typeof order.user !== 'string' ? (
                                    <span className='font-medium text-gray-900'>
                                        {user.email}
                                    </span>
                                ) : null}
                                .
                            </p>
                        ) : (
                            <p className='mt-2 text-base text-muted-foreground'>
                                We appreciate your order, and we&apos;re
                                currently processing it. So hang tight and
                                we&apos;ll send you confirmation very soon!
                            </p>
                        )}

                        <div className='mt-16 text-sm font-medium'>
                            <div className='text-muted-foreground'>
                                Order nr.
                            </div>
                            <div className='mt-2 text-gray-900'>
                                {order._id as string} {/* Cast to string to resolve type error */}
                            </div>

                            <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                                {order.products.map(
                                    (product: any) => {
                                        const label = PRODUCT_CATEGORIES.find(
                                            ({ value }) =>
                                                value === product.category
                                        )?.label;

                                        const { image } = product.images[0];

                                        return (
                                            <li
                                                key={product._id}
                                                className='flex space-x-6 py-6'
                                            >
                                                <div className='relative h-24 w-24'>
                                                    {typeof image !== 'string' &&
                                                    'url' in image ? (
                                                        <img
                                                            src={image.url as string}
                                                            alt={`${product.name} image`}
                                                            className='flex-none rounded-md bg-gray-100 object-cover'
                                                        />
                                                    ) : null}
                                                </div>

                                                <div className='flex-auto flex flex-col justify-between'>
                                                    <div className='space-y-1'>
                                                        <h3 className='text-gray-900'>
                                                            {product.name}
                                                        </h3>

                                                        <p className='my-1'>
                                                            Category: {label}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className='flex-none font-medium text-gray-900'>
                                                    {formatPrice(product.price)}
                                                </p>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>

                            <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                                <div className='flex justify-between'>
                                    <p>Subtotal</p>
                                    <p className='text-gray-900'>
                                        {formatPrice(orderTotal)}
                                    </p>
                                </div>

                                <div className='flex justify-between'>
                                    <p>Transaction Fee</p>
                                    <p className='text-gray-900'>
                                        {formatPrice(orderTotal * 0.03)}
                                    </p>
                                </div>

                                <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                                    <p className='text-base'>Total</p>
                                    <p className='text-base'>
                                        {formatPrice(orderTotal + orderTotal * 0.03)}
                                    </p>
                                </div>
                            </div>

                            <PaymentStatus
                                isPaid={order._isPaid}
                                orderEmail={user?.email}
                                orderId={order._id as string}
                            />

                            <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                                <a
                                    href='/products'
                                    className='text-sm font-medium text-pink hover:text-pink'>
                                    Continue shopping &rarr;
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ThankYouPage;