'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import ProductListing from './ProductListing';
import { IProduct } from '../schema/Product';
import axios from 'axios';
import Spinner from './Spinner';

interface ProductReelProps {
  title: any; 
  subtitle?: string;
  href?: string;
  textColor: string;
}

const ProductReel = ({ title, subtitle, href, textColor }: ProductReelProps) => {
  const [approvedProducts, setApprovedProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Track total pages
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null); // Ref for loading indicator
  const productsPerPage = 16; // Number of products per page

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/approved`, {
        params: { page: currentPage, limit: productsPerPage },
        withCredentials: true
      });

      if (response.data && Array.isArray(response.data.products)) {
        // Check if we are on the first page
        if (currentPage === 1) {
          setApprovedProducts(response.data.products); // Set products for the first page
        } else {
          // Append new products only if they are not already in the list
          setApprovedProducts(prev => {
            const existingIds = new Set(prev.map(product => product._id)); // Create a set of existing product IDs
            const newProducts = response.data.products.filter((product: IProduct) => !existingIds.has(product._id)); // Filter out duplicates
            return [...prev, ...newProducts]; // Append new products
          });
        }
        setTotalPages(response.data.totalPages); // Ensure this is set correctly

        // Check if we have reached the last page
        if (currentPage >= response.data.totalPages) {
          setNoMoreProducts(true); // Set no more products state
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1); // Load next page
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef, currentPage, totalPages]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-reel-container">
      <section className="py-12">
        <div className="md:flex md:items-center md:justify-between mb-4">
          <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            {title && (
              <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: textColor, fontFamily: 'Helvetica' }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground" style={{ color: textColor, fontFamily: 'Helvetica' }}>
                {subtitle}
              </p>
            )}
          </div>
          {href && (
            <a
              href={href}
              className="hidden text-sm font-medium text-gray hover:text-gray md:block"
              style={{ color: textColor, fontFamily: 'Helvetica' }}
            >
              Shop now <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>

        <div className="relative">
          <div className="mt-6 flex items-center w-full">
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
              {approvedProducts.map((product: IProduct, i: number) => (
                <ProductListing key={`product-${i}`} product={product} index={i} textColor={textColor} />
              ))}
            </div>
          </div>
          {/* Conditional rendering for loading indicator */}
          {!noMoreProducts && (
            <div ref={loadingRef} className="loading-indicator">
              <Spinner />
            </div>
          )}
          {noMoreProducts && <p></p>} {/* Display message when no more products */}
        </div>
      </section>
    </div>
  );
};

export default ProductReel;