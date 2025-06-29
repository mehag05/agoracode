import React from 'react'
import { PRODUCT_CATEGORIES } from '../config/config'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/utils'
import { IProduct } from '../schema/Product'
import { ImageIcon, X } from 'lucide-react'

interface mimage {
  image: string
  id?: string | null | undefined
}

const CartItem = (
  { product }: { product: IProduct }
) => {
  const image = product.images[0]?.image; // Simplified image extraction

  const { removeItem } = useCart()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  return (
    <div className='space-y-3 py-2'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded'>
              {image ? ( // Simplified check
                <img
                  src={image} // Directly use the image URL
                  alt={product.name}
                  width={100}
                  height={100}
                  className='absolute object-cover'
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

          <div className='flex flex-col self-start'>
            <span className='line-clamp-1 text-sm font-medium mb-1'>
              {product.name}
            </span>

            <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
              {label}
            </span>

            <div className='mt-4 text-xs text-muted-foreground'>
              <button
                onClick={() => removeItem(product._id as string)}
                className='flex items-center gap-0.5'>
                <X className='w-3 h-4' />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-1 font-medium'>
          <span className='ml-auto line-clamp-1 text-sm'>
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem