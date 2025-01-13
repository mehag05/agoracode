import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { FetchUser } from '../utils/fetchUser';
import axios from 'axios';
import { IOrder } from '../schema/Order';
import { formatPrice } from '../lib/utils';
import { useCart } from '../hooks/useCart';
import Spinner from 'components/Spinner';

const UserOrdersPage = () => {
    const { user, error } = FetchUser(); // Fetch user details
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const { clearCart } = useCart();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const clearCartParam = queryParams.get('clear');

        if (clearCartParam === 'true') {
            clearCart();
        }
    }, [location, clearCart]);

    useEffect(() => {
        const abortController = new AbortController(); // Create an AbortController instance
        const fetchOrders = async () => {
            if (user) {
                try {
                    // Step 1: Fetch all orders for the user
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/myorders/${user.supertokens_id}`);
                    const ordersData = response.data;

                    // Set the orders state directly since the product details are included in the order
                    setOrders(ordersData);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            abortController.abort(); // Cleanup function to abort the request
        };
    }, [user]);

    // Rendering orders
    if (loading) return <div><Spinner/></div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <Navigate to="/auth/signin" />; // Redirect to sign-in if user is not authenticated

    return (
        <main className='relative lg:min-h-full'>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                    Your Orders
                </h1>
                <p className='mt-4 text-lg text-gray-700'>Here you can track the status of your orders and see the products you have bought. Try refreshing if your order is not coming up.</p>
                {orders.length === 0 ? (
                    <p className='mt-4 text-lg text-gray-700'>You have no orders yet.</p>
                ) : (
                    orders.map((order) => {
                        const product = order.products[0]; // Access the first product directly from the order
                        return (
                            <div key={order._id as string} className='mt-8 border-t border-gray-200 pt-6'>
                                <div className='flex items-center'> {/* Change to items-center for vertical alignment */}
                                    <img src={product.image} alt={product.name} className='w-20 h-20 object-cover rounded-lg mr-4' /> {/* Add rounded corners */}
                                    <div className='flex flex-col'> {/* Wrap text in a div for better alignment */}
                                        <h2 className='text-lg font-medium text-gray-900'>{product.name}</h2>
                                        <p className='mt-2 text-sm text-gray-600'>Status: {order.status}</p>
                                    </div>
                                </div>
                                <ul className='mt-4 divide-y divide-gray-200'>
                                    <li key={product.productId as string} className='flex justify-between py-4'>
                                        <span className='text-gray-800'>{formatPrice(product.price)}</span>
                                    </li>
                                </ul>
                                <div className='mt-4 flex justify-between'>
                                    <span className='font-medium text-gray-900'>Total:</span>
                                    <span className='font-medium text-gray-900'>
                                        {formatPrice(order.total_price / 100)} 
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
};

export default UserOrdersPage;