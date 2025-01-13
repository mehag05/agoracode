import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { useDropzone } from 'react-dropzone';
import Session from 'supertokens-auth-react/recipe/session';

const ProductUploadForm: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'clothing-item',
    size: '',
    ticketLink: '',
    images: [] as File[],
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const parsedPrice = parseFloat(value);
      if (!isNaN(parsedPrice) || value === '') {
        setProduct((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
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

    setProduct((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!product.name || !product.description || product.price as unknown as number <= 0 || !product.category) {
        window.alert('please fill in all fields correctly.');
        return;
    }

    if (product.category === 'clothing-item' && !product.size) {
        window.alert('size is required for clothing items.');
        return;
    }

    if (product.category === 'event-ticket' && !product.ticketLink) {
        window.alert('ticket link is required for event tickets.');
        return;
    }
    if (isNaN(product.price as unknown as number)) {
      window.alert('price must be a valid number.');
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('size', product.size);
    formData.append('ticketLink', product.ticketLink);

    product.images.forEach((file) => {
      formData.append('images', file);
    });

    console.log('Submitting product:', {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        size: product.size,
        ticketLink: product.ticketLink,
        images: product.images.map(file => file.name),
    });
    const accessToken = await Session.getAccessToken();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Upload response:', response);
      if (response.status === 201) {
        window.location.reload();
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: handleDrop,
    accept: { 'image/jpeg': ['.jpeg'], 'image/png': ['.png'], 'image/jpg': ['.jpg'], 'image/gif': ['.gif'], 'image/webp': ['.webp'], 'image/svg+xml': ['.svg'] },
  });

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Upload Product</h1>
      {error && <div className="text-red-500">{error}</div>}
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
            value={product.description}
            onChange={handleChange}
            placeholder='How would you sell this to a recruiter at a career fair? ;)'
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
            <option value='event-ticket'>Event Ticket</option>
            <option value='other'>Other</option>
            <option value='lease'>Lease</option>
          </select>
        </div>

        {/* Conditionally render size input for clothing items */}
        {product.category === 'clothing-item' && (
          <div>
            <label className='block text-sm font-medium'>Size</label>
            <input
              type='text'
              name='size'
              value={product.size}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              required
            />
          </div>
        )}

        {/* Conditionally render ticket link input for event tickets */}
        {product.category === 'event-ticket' && (
          <div>
            <label className='block text-sm font-medium'>Ticket Link</label>
            <input
              type='text'
              name='ticketLink'
              value={product.ticketLink}
              onChange={handleChange}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              required
            />
          </div>
        )}

        <div {...getRootProps()} className='border border-dashed border-gray-300 rounded-md p-4 cursor-pointer'>
          <input {...getInputProps()} />
          <p>Drag & drop some files here, or click to select files</p>
        </div>

        <div className='mt-2'>
          {product.images.map((file, index) => (
            <div key={index} className='flex justify-between items-center mt-2'>
              <img src={URL.createObjectURL(file)} alt={`Uploaded Image ${index + 1}`} className='w-16 h-16 object-cover rounded-md' />
              <button type="button" onClick={() => removeImage(index)} className='text-red-500'>X</button>
            </div>
          ))}
        </div>

        <Button variant="bigpurple" type="submit">
          Upload product
        </Button>
      </form>
    </div>
  );
};

export default ProductUploadForm;