'use client'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import ProductReel from '../components/ProductReel'
import React, { useEffect, useState, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';

type Param = string | string[] | undefined

const PRODUCT_CATEGORIES = [
  { value: 'clothing-item', label: 'Clothing Item' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'dorm-item', label: 'Dorm Item' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'event-ticket', label: 'Event Ticket' },
  { value: 'other', label: 'Other' },
  { value: 'lease', label: 'Lease' },
];

interface ProductsPageProps {
  searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}

const ProductsPage = ({
  searchParams,
}: ProductsPageProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  // Memoize the label based on the category
  const label = useMemo(() => {
    return PRODUCT_CATEGORIES.find(
      ({ value }) => value === category
    )?.label;
  }, [category]); // Recompute when category changes

  return (
    <MaxWidthWrapper>
      <div className="products-page-container">
        <div className="category-label" style={{ color: 'gray', fontFamily: 'Helvetica' }}>
          {label && <p>Category: {label}</p>}
        </div>
        <ProductReel
          title={
            <TypeAnimation
              sequence={[
                'Browse Anything',
                2000,
                'Browse Shoes',
                2000,
                'Browse Dorm Stuff',
                2000,
                'Browse Sweatpants',
                2000,
                'Browse Jewelry',
                2000,
                'Browse Leases',
                2000,
                'Browse Graphic Tees',
                2000,
                'Browse Bikes',
                2000,
                'Browse Microwaves',
                2000,
                'Browse Cardigans',
                2000,
              ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: '1.5em', display: 'inline-block', color: '#4b0082', fontFamily: 'Helvetica' }}
              repeat={Infinity}
            />
          }
          textColor='gray'
        />
      </div>
    </MaxWidthWrapper>
  )
}
export default ProductsPage