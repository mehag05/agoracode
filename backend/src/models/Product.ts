import mongoose, { Schema, Document } from 'mongoose';
import ProductFile from './ProductFile';

export interface IProduct extends Document {
  user: string;
  name: string;
  description?: string | null;
  price: number;
  category: 'clothing-item' | 'accessories' | 'dorm-item' | 'shoes' | 'event-ticket' | 'other' | 'lease';
  product_files: string | mongoose.Types.ObjectId;
  size?: string;
  ticketLink?: string;
  approvedForSale?: 'pending' | 'approved' | 'denied' | 'sold' | 'delivered' | null;
  priceId?: string | null;
  stripeId?: string | null;
  images: {
    image: string;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}

const productSchema: Schema = new Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['clothing-item', 'accessories', 'dorm-item', 'shoes', 'event-ticket', 'other', 'lease'],
    required: true,
  },
  product_files: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductFile' },
  size: { type: String },
  ticketLink: { type: String },
  approvedForSale: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'sold', 'delivered'], // Use enum to restrict values
    default: 'pending', // Default value
  },
  priceId: { type: String },
  stripeId: { type: String },
  images: [
    {
      image: { type: String, required: true },
      id: { type: String },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model<IProduct>('Product', productSchema);
export default ProductModel;