'use client'
import React from 'react'
import { Button } from '../components/ui/button'
import { PRODUCT_CATEGORIES } from '../config/config'
import { useCart } from '../hooks/useCart'
import { cn, formatPrice } from '../lib/utils'
import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import CheckoutButton from '../components/CheckoutButton'
import { ImageIcon } from 'lucide-react'
import { IProduct } from 'schema/Product'
import axios from 'axios'
import { IUser } from 'schema/user'

const AGORA_FEE_PERCENTAGE = 0.1; // Define the Agora fee percentage

const CartPage = () => {
  const { items, removeItem } = useCart()

  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add state for error message

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const subtotal = items.reduce((total, { product }) => total + product.price, 0);

  const totalAgoraFee = items.reduce((total, { product }) => {
    const productPrice = product.price;
    const sellerFeePreference = (axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/${product.user}`) as unknown as IUser).agora_fee; // Assuming you have access to seller's fee preference

    // Add Agora fee if seller's preference is false
    const fee = sellerFeePreference ? 0 : productPrice * AGORA_FEE_PERCENTAGE;
    return fee;
  }, 0);

  // if any items in cart are sold or delivered, give the user an alert and remove those item(s) from cart
  // test
  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController instance
    const checkProductAvailability = async () => { // Move the function inside useEffect
      const unavailableItems: string[] = [];

      for (const { product } of items) {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product/${product._id}`);
          const currentProduct: IProduct = response.data;

          if (currentProduct.approvedForSale === 'sold' || currentProduct.approvedForSale === 'delivered') {
              unavailableItems.push(currentProduct.name);
          }
      }

      if (unavailableItems.length > 0) {
          setErrorMessage(`These items are not in stock: ${unavailableItems.join(', ')}`); // Set error message
          console.log(unavailableItems);
          removeUnavailableItems(unavailableItems); // Call to remove unavailable items
      } else {
          setErrorMessage(null); // Clear error message if all items are available
      }

      return unavailableItems;
    };

    checkProductAvailability(); // Call the function to check product availability

    return () => {
      abortController.abort(); // Cleanup function to abort the request
    };
  }, [items]); // Ensure it runs when items change

  const removeUnavailableItems = (unavailableItems: string[]) => {
    unavailableItems.forEach(itemName => {
      const itemToRemove = items.find(({ product }) => product.name === itemName);
      if (itemToRemove) {
        removeItem(itemToRemove.product.id); // Remove item from cart
      }
    });
  };

  return (
    <div className='bg-white'>
      {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Shopping Cart
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            })}>
            <h2 className='sr-only'>
              Items in your shopping cart
            </h2>

            {isMounted && items.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
                <div
                  aria-hidden='true'
                  className='relative mb-4 h-40 w-40 text-muted-foreground'>
                  <img
                    src='/empty-cart.png'
                    width={100}
                    height={100}
                    loading='eager'
                    alt='empty shopping cart'
                  />
                </div>
                <h3 className='font-semibold text-2xl'>
                  Your cart is empty
                </h3>
                <p className='text-muted-foreground text-center'>
                  Whoops! nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}>
              {isMounted &&
                items.map(({ product }) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === product.category
                  )?.label

                  return (
                    <li
                      key={product.id}
                      className='flex py-6 sm:py-10'>
                      <div className='flex-shrink-0'>
                        <div className='relative h-24 w-24'>
                          {product.images[0]?.image ? ( // Check if the image exists
                            <img
                              width={100}
                              height={100}
                              src={product.images[0].image} // Use the image URL directly
                              alt='product image'
                              className='h-full w-full rounded-md object-cover object-center'
                            />
                          ) : (
                            <div className='flex h-full items-center justify-center bg-secondary'>
                              <ImageIcon
                                aria-hidden='true'
                                className='h-4 w-4 text-muted-foreground'
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                        <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                          <div>
                            <div className='flex justify-between'>
                              <h3 className='text-sm'>
                                <a
                                  href={`/product/${product.id}`}
                                  className='font-medium text-gray-700 hover:text-gray-800'>
                                  {product.name}
                                </a>
                              </h3>
                            </div>

                            <div className='mt-1 flex text-sm'>
                              <p className='text-muted-foreground'>
                                Category: {label}
                              </p>
                            </div>

                            <p className='mt-1 text-sm font-medium text-gray-900'>
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className='mt-4 sm:mt-0 sm:pr-9 w-20'>
                            <div className='absolute right-0 top-0'>
                              <Button
                                aria-label='remove product'
                                onClick={() =>
                                  removeItem(product.id)
                                }
                                variant='ghost'>
                                <X
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>

          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>
              Order summary
            </h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>
                  Subtotal
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(subtotal)
                  ) : (
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>
                  Agora Fee
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(totalAgoraFee)
                  ) : (
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </p>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>
                  Tax
                </p>
                <p className='text-sm font-medium text-gray-900'>
                  Calculated at checkout
                </p>
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>
                  Order Total
                </div>
                <div className='text-base font-medium text-gray-900'>
                  {isMounted ? (
                    formatPrice(subtotal + totalAgoraFee)
                  ) : (
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <CheckoutButton items={items} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
export default CartPage