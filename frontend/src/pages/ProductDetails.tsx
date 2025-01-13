import AddToCartButton from '../components/AddToCartButton'
import ImageSlider from '../components/ImageSlider'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import ProductReel from '../components/ProductReel'
import { formatPrice } from '../lib/utils'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { IProduct } from '../schema/Product'
import { FetchUser } from 'utils/fetchUser'
import { Button } from 'components/ui/button'
import Spinner from 'components/Spinner'

// TODO: Make this import universal
const PRODUCT_CATEGORIES = [
    { value: 'clothing-item', label: 'Clothing Item' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'dorm-item', label: 'Dorm Item' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'event-ticket', label: 'Event Ticket' },
    { value: 'other', label: 'Other' },
    { value: 'lease', label: 'Lease' },
  ];

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]

interface Image {
  image: string | { url: string }
}

const ProductDetails = () => {
  const { id: productId } = useParams(); // Extract productId from URL parameters
  const [product, setProduct] = React.useState<IProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { user, loading: userLoading, error: userError } = FetchUser()

  React.useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController instance
    const fetchProductData = async () => {
      console.log(`Fetching product with ID: ${productId}`); // Debugging log
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product/${productId}`);
        if (response.status === 200 && response.data) {
          setProduct(response.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching product:', error); // Log the error for debugging
        setError('Error fetching the product. Please try again later.');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();

    return () => {
      abortController.abort(); // Cleanup function to abort the request
    };
  }, [productId]);
  
  // Memoize the label based on the product category
  const label = useMemo(() => {
    return PRODUCT_CATEGORIES.find(({ value }) => value === product?.category)?.label;
  }, [product?.category]); // Recompute when product category changes

  // Memoize valid URLs for images
  const validUrls = useMemo(() => {
    if (!product || !product.images) return []; // Return an empty array if product or images are not available
    return product.images
      .map((image: Image) => (typeof image.image === 'string' ? image.image : image.image.url))
      .filter(Boolean) as string[];
  }, [product]); // Recompute when product changes

  if (loading || userLoading) return <div><Spinner/></div>;
  if (notFound) return <div>{error || 'Product not found.'}</div>;

  return (
    <MaxWidthWrapper className='bg-white'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          {/* Product Details */}
          <div className='lg:max-w-lg lg:self-end'>
            <ol className='flex items-center space-x-2'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    <a
                      href={breadcrumb.href}
                      className='font-medium text-sm text-muted-foreground hover:text-gray-900'>
                      {breadcrumb.name}
                    </a>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className='mt-4'>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {product?.name}
              </h1>
            </div>

            <section className='mt-4'>
              <div className='flex items-center'>
                <p className='font-medium text-gray-900'>
                  {product ? formatPrice(product.price) : 'N/A'}
                </p>

                <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                  {label || 'N/A'}
                </div>

                {/* Display size if product is a clothing item */}
                {product?.category === 'clothing-item' && product?.size && (
                  <div className='ml-4 border-l text-muted-foreground border-gray-300 pl-4'>
                    Size: {product.size}
                  </div>
                )}
              </div>

              <div className='mt-4 space-y-6'>
                <p className='text-base text-muted-foreground'>
                  {product?.description}
                </p>
              </div>
            </section>
          </div>

          {/* Product images */}
          <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
            <div className='aspect-square rounded-lg'>
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* add to cart part */}
          <div className='mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start'>
            <div>
              <div className='mt-10'>
                {product && user&& <AddToCartButton product={product} user={user} />}
              </div>
            </div>
          </div>
          <div className='mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start'>
            <div>
              <div className='mt-10'>
                {!user && <Button variant='bigpurple' onClick={() => window.location.href = '/auth/signin'}>Sign in to add to cart</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href={`/products`}
        title={`Similar ${label}`}
        subtitle={`Browse Similar ${label} just like '${product?.name}'`}
        textColor='gray'
      />
    </MaxWidthWrapper>
  )
}

export default ProductDetails