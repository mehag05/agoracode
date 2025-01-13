import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IProduct } from '../schema/Product';
import { Button } from '../components/ui/button';
import { useDropzone } from 'react-dropzone';
import ErrorBoundary from './errorboundary';
import Spinner from './Spinner';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product/${id}`, {
          signal: abortController.signal,
        });
        setProduct(response.data);
        setImages(response.data.images.map((img: { image: string }) => img.image));
        setRemovedImages([]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Fetch canceled:', error.message);
        } else {
          console.error('Error fetching product:', error);
          setError('Failed to fetch product details.');
        }
      }
    };

    fetchProduct();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (product) {
      setProduct({ ...product, [name]: value } as IProduct);
    }
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
    const newImages: File[] = [];

    for (const file of acceptedFiles) {
      if (!validImageTypes.includes(file.type)) {
        window.alert('You must have uploaded an unsupported image type. HEIC files make our site slow :(. Try JPG, JPEG, PNG, or even GIF! Happy selling!');
        return;
      }
      newImages.push(file);
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number, isNewImage: boolean) => {
    if (isNewImage) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const imageToRemove = product?.images[index]?.image;
      if (imageToRemove) {
        setRemovedImages((prev) => [...prev, imageToRemove]);
      }
      setProduct((prevProduct) => {
        if (!prevProduct) return null;
        const updatedImages = prevProduct.images.filter((_, i) => i !== index);
        return { ...prevProduct, images: updatedImages } as IProduct;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description || '');
      formData.append('price', product.price.toString());
      formData.append('category', product.category);
      formData.append('size', product.size || '');
      formData.append('ticketLink', product.ticketLink || '');
      formData.append('approvedForSale', 'pending');

      product.images.forEach((img) => {
        if (!removedImages.includes(img.image)) {
          formData.append('images', img.image);
        }
      });

      images.forEach((file) => {
        formData.append('images', file);
      });

      try {
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/products/edit/${id}`, formData);
        navigate('/sell');
      } catch (error) {
        console.error('Error updating product:', error);
        setError('Failed to update product.');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/jpeg': ['.jpeg'], 'image/png': ['.png'], 'image/jpg': ['.jpg'], 'image/gif': ['.gif'], 'image/webp': ['.webp'], 'image/svg+xml': ['.svg'] },
  });

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) return <div><Spinner/></div>;

  return (
    <ErrorBoundary>
      <div className='p-4'>
        <h1 className='text-xl font-bold mb-4'>Edit Product</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Product Name</label>
            <input
              type='text'
              name='name'
              value={product.name}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Description</label>
            <textarea
              name='description'
              value={product.description || ''}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Price</label>
            <input
              type='number'
              name='price'
              value={product.price}
              onChange={handleChange}
              required
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Category</label>
            <select
              name='category'
              value={product.category}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            >
              <option value='clothing-item'>Clothing Item</option>
              <option value='accessories'>Accessories</option>
              <option value='dorm-item'>Dorm Item</option>
              <option value='shoes'>Shoes</option>
              {/* <option value='event-ticket'>Event Ticket</option> */}
              <option value='other'>Other</option>
              {/* <option value='lease'>Lease</option> */}
            </select>
          </div>

          {product.category === 'clothing-item' && (
            <div>
              <label className='block text-sm font-medium'>Size</label>
              <input
                type='text'
                name='size'
                value={product.size || ''}
                onChange={handleChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              />
            </div>
          )}

          {product.category === 'event-ticket' && (
            <div>
              <label className='block text-sm font-medium'>Ticket Link</label>
              <input
                type='text'
                name='ticketLink'
                value={product.ticketLink || ''}
                onChange={handleChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              />
            </div>
          )}

          <div>
            <div {...getRootProps()} className='border border-dashed border-gray-300 rounded-md p-4 cursor-pointer'>
              <input {...getInputProps()} />
              <p>Drag & drop new images here, or click to select files</p>
            </div>
            <h2>Images</h2>
            {product.images.length > 0 && (
              <>
                {product.images.map((img, index) => (
                  <div key={`existing-${index}`} className='flex justify-between items-center mt-2'>
                    <img src={img.image} alt={`Product Image ${index + 1}`} className='w-16 h-16 object-cover rounded-md' />
                    <button type="button" onClick={() => removeImage(index, false)} className='text-red-500'>Remove</button>
                  </div>
                ))}
              </>
            )}
            {images.length > 0 && (
              <>
                {images.map((file, index) => {
                  try {
                    const objectURL = URL.createObjectURL(file);
                    return (
                      <div key={`new-${index}`} className='flex justify-between items-center mt-2'>
                        <img src={objectURL} alt={`New Image ${index + 1}`} className='w-16 h-16 object-cover rounded-md' />
                        <button type="button" onClick={() => removeImage(index, true)} className='text-red-500'>Remove</button>
                      </div>
                    );
                  } catch (error) {
                    console.error('Failed to create object URL:', error);
                    return null;
                  }
                })}
              </>
            )}
          </div>

          <Button variant="bigpurple" type="submit">
            Update Product
          </Button>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default EditProduct;