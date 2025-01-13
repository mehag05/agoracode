'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '../hooks/useCart'
import { IProduct } from '../schema/Product'
import { buttonVariants } from '../components/ui/button'
import { IUser } from '../schema/user'

const AddToCartButton = ({
  product,
  user
}: {
  product: IProduct
  user: IUser
}) => {
  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (isSuccess) { // Only set the timeout if isSuccess is true
      const timeout = setTimeout(() => {
        setIsSuccess(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isSuccess]) // Keep isSuccess as a dependency to clear the timeout if it changes

  return (
    // TODO: add inventory amount so only one product can be added
    <Button
      onClick={() => {
        console.log(product.user)
        console.log(user.supertokens_id)
        addItem(product, user.supertokens_id)
        setIsSuccess(true)
      }}
      size='lg'
      className={buttonVariants({ variant: 'bigpurple' }) + ' w-full'}>
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
 )
}

export default AddToCartButton