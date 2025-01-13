'use client'

import type { IProduct } from '../schema/Product'
import React, { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import { Link } from 'react-router-dom'
import { cn, formatPrice } from '../lib/utils'
import ImageSlider from './ImageSlider'

interface ProductListingProps {
  product: IProduct | null
  index: number
  textColor: string
}

const PRODUCT_CATEGORIES = [
    { value: 'clothing-item', label: 'Clothing Item' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'dorm-item', label: 'Dorm Item' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'event-ticket', label: 'Event Ticket' },
    { value: 'other', label: 'Other' },
    { value: 'lease', label: 'Lease' },
  ];

const ProductListing = ({
  product,
  index,
  textColor,
}: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (product && product.images) {
      const newImages = product.images.map(({ image }) => image);
      setConvertedImages(newImages);
    }
  }, [product]);

  if (!product) return <ProductPlaceholder />; // Show placeholder if no product

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  return (
    <div className="product-listing-container">
      {isVisible && (
        <Link
          className={cn(
            'invisible h-full w-full cursor-pointer group/main',
            {
              'visible animate-in fade-in-5': isVisible,
            }
          )}
          to={`/product/${product._id}`}
        >
          <div className='flex flex-col w-full'>
            <ImageSlider urls={convertedImages.length > 0 ? convertedImages : product?.images.map(({ image }) => image)} />
            <h3 className='mt-4 font-medium text-sm' style={{ color: textColor }}>
              {product.name}
            </h3>
            <p className='mt-1 text-sm' style={{ color: textColor }}>
              {label}
            </p>
            {product.category === 'clothing-item' && product.size && ( // Conditionally render size
              <p className='mt-1 text-sm' style={{ color: textColor }}>
                Size: {product.size}
              </p>
            )}
            <p className='mt-1 font-medium text-sm' style={{ color: textColor }}>
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

const ProductPlaceholder = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl'>
        <Skeleton className='h-full w-full' />
      </div>
      <Skeleton className='mt-4 w-2/3 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-16 h-4 rounded-lg' />
      <Skeleton className='mt-2 w-12 h-4 rounded-lg' />
    </div>
  )
}

export default ProductListing