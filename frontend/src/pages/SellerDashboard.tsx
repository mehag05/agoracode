import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FetchUser } from '../utils/fetchUser';
import { IProduct } from '../schema/Product';
import ProductUploadForm from '../components/ProductUploadForm';
import { Button } from '../components/ui/button';
import ConnectForm from '../components/StripeAccountForm';
import { IOrder } from 'schema/Order';
import Session from 'supertokens-auth-react/recipe/session';
import Switch from '../components/ui/switch';

const SellerDashboard = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const { user, loading, error: fetchUserError } = FetchUser();
  const userId = user?.supertokens_id;
  const [error, setError] = useState<string | null>(null);
  const [agoraFeeIncluded, setAgoraFeeIncluded] = useState(user?.agora_fee ?? false);

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  const fetchProducts = async () => {
    if (!userId) {
      setError("User ID is not available.");
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/productslisted/${userId}`);
      setProducts(response.data);
    } catch (error: any) {
      setError(error.response ? error.response.data : 'Error fetching products');
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchProducts();
    }
  }, [loading, user]);

  // Memoize the ordered products check
  const orderedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product._id as string] = product.approvedForSale === 'sold';
      return acc;
    }, {} as Record<string, boolean>);
  }, [products]);

  const markOrderAsDelivered = async (productId: string) => {
    const confirmDelivery = window.confirm(
        "Are you sure you want to mark this item as delivered? If the item is not delivered to the buyer's delivery location that you were sent by email, you could lose your seller status."
    );

    if (!confirmDelivery) {
        return; // Exit if the user cancels
    }

    try {
        // Fetch the order that contains the product ID
        const accessToken = await Session.getAccessToken();
        const orderResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order-by-product/${productId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Include the auth token
            }
        });
        const order = orderResponse.data;
        console.log(order);

        if (!order) {
            console.error('Order not found for product ID:', productId);
            return; // Handle the case where the order is not found
        }

        // Now mark the found order as delivered
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/deliverorder/${order._id}`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Include the auth token
            }
        });
        
        // Update the product state to reflect that it has been delivered
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === productId ? { ...product, approvedForSale: 'delivered' } as IProduct : product
            )
        );

        if (response.status === 200) {
            console.log('Order marked as delivered:', order._id);
            // Optionally refresh the product list or state
        }
        window.location.reload();
    } catch (error: any) {
        setError(error.response ? error.response.data : 'Error marking product as delivered');
        console.error('Error handling delivery:', error);
    }
  };

  const handleFeeToggle = async () => {
    try {
      const accessToken = await Session.getAccessToken();
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/update-fee-preference`,
        { agora_fee: !agoraFeeIncluded },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      setAgoraFeeIncluded(!agoraFeeIncluded);
    } catch (error: any) {
      setError(error.response ? error.response.data : 'Error updating fee preference');
    }
  };

  return (
    <div className="p-8">
      {user && user.stripe_account_id == null && (
          <div className="mt-8">
            <ConnectForm />
          </div>
      )}
      <div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Seller Dashboard</h1>
        <div className="mb-6">
          {user && user.stripe_account_id && ( // Check if stripe_account_id is populated
            <Button 
              onClick={toggleFormVisibility} 
              variant="bigpurple" 
              className="transition duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-purple-300"
            >
              {isFormVisible ? 'Cancel' : 'Add product'}
            </Button>
          )}
        </div>
        {isFormVisible && user && user.stripe_account_id && ( // Ensure form is only shown if stripe_account_id is populated
          <div className="mb-8">
            <ProductUploadForm />
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Products</h2>
        <div className="overflow-x-auto rounded-lg shadow-inner">
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead className="bg-purple-100 text-gray-700">
              <tr>
                <th className="text-left px-6 py-4 border-b border-gray-300">Product Name</th>
                <th className="text-left px-6 py-4 border-b border-gray-300">Status</th>
                <th className="text-left px-6 py-4 border-b border-gray-300"></th>
                <th className="text-left px-6 py-4 border-b border-gray-300">Edit</th>
                <th className="text-left px-6 py-4 border-b border-gray-300">Mark as Delivered</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: IProduct) => (
                <tr key={product._id as string} className="hover:bg-purple-50 transition duration-200">
                  <td className="px-6 py-4 border-b border-gray-300">{product.name}</td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <span 
                      className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-md ${
                        product.approvedForSale === 'approved' ? 'bg-[--purple]' :
                        product.approvedForSale === 'pending' ? 'bg-[--gold]' :
                        product.approvedForSale === 'denied' ? 'bg-red-500' :
                        product.approvedForSale === 'sold' ? 'bg-gray-500' : 'bg-gray-300'
                      }`}
                    >
                      {product.approvedForSale!.charAt(0).toUpperCase() + product.approvedForSale!.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <img 
                      src={product.images[0].image} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <a 
                      href={`/edit-product/${product._id}`} 
                      className={`text-[--gold] font-bold hover:underline ${orderedProducts[product._id as string] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={e => {
                        if (orderedProducts[product._id as string]) {
                          e.preventDefault(); // Prevent navigation if the product is sold or delivered
                        }
                      }}
                    >
                      Edit
                    </a>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    {orderedProducts[product._id as string] && (
                      <Button variant="bigpurple" onClick={() => markOrderAsDelivered(product._id as string)}>Mark as Delivered</Button>
                    )}
                    {product.approvedForSale === 'delivered' && (
                      <span className="text-green-500">Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Switch
              checked={agoraFeeIncluded}
              onChange={handleFeeToggle}
            />
            <div className="flex flex-col">
              <span className="font-semibold">Agora Fee</span>
              <span className="text-sm text-gray-600">
                {agoraFeeIncluded 
                  ? "Agora's seller fee will be deducted from your set price when you receive your funds" 
                  : "Agora's seller fee will be added to the buyer's total checkout price"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;