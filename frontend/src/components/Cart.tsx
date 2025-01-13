'use client'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Separator } from './ui/separator'
import { formatPrice } from '../lib/utils'
import { Link } from 'react-router-dom'
import { buttonVariants } from './ui/button'
import { useCart } from '../hooks/useCart'
import { ScrollArea } from './ui/scroll-area'
import CartItem from './CartItem'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FetchUser } from 'utils/fetchUser'

// redirect to login page if not authenticated

const Cart = () => {
  const { items } = useCart()
  const itemCount = items.length
  const navigate = useNavigate()

  const [isMounted, setIsMounted] = useState<boolean>(false)

  // Call the custom hook at the top level of the component
  const { user, loading, error } = FetchUser(); // or useFetchUser if it's a hook

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  )

  const handleCheckout = () => {
    const firstName = user?.firstName 
    const lastName = user?.lastName
    const deliveryLocation = user?.deliveryLocation
    const customLocation = user?.customLocation

    if (firstName == '' || lastName == '' || deliveryLocation == '') {
      if (deliveryLocation == 'Off campus residence' || deliveryLocation == 'Dorm Room' && customLocation == '' || customLocation == null) {
        window.alert('Please complete your profile information before proceeding to checkout.')
      } else {
        window.alert('Please complete your profile information before proceeding to checkout.')
      }
      navigate('/settings')
    } else {
      navigate('/cart')
    }
  }

  return (
    <Sheet>
      <SheetTrigger className='group -m-2 flex items-center p-2'>
        <ShoppingCart
          aria-hidden='true'
          className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
        />
        <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg bg-white'>
        <SheetHeader className='space-y-2.5 pr-6'>
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className='flex w-full flex-col pr-6'>
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem
                    product={product}
                    key={product.id}
                  />
                ))}
              </ScrollArea>
            </div>
            <div className='space-y-4 pr-6'>
              <Separator />
              <div className='space-y-1.5 text-sm'>
                <div className='flex'>
                  <span className='flex-1'>Shipping</span>
                  <span>Free, duh!</span>
                </div>
                <div className='flex'>
                  <span className='flex-1'>Total</span>
                  <span>
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <a
                    onClick={handleCheckout}
                    className={`${buttonVariants({ variant: 'bigpurple' })} w-full`}>
                    Continue to Checkout
                  </a>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <div
              aria-hidden='true'
              className='relative mb-4 h-60 w-60 text-muted-foreground flex items-center justify-center'>
              <img
                src='/empty-cart.png'
                alt='empty shopping cart'
                width={100}
                height={100}
              />
            </div>
            <div className='text-xl font-semibold'>
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <a
                href='/products'
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className:
                    'text-sm text-muted-foreground',
                })}>
                Add items to your cart to checkout
              </a>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart
