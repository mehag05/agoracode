import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

export interface IOrder extends Document {
  id: string;
  _isPaid: boolean;
  user: string;
  products: {
    productId: string; // ID of the product
    name: string; // Product name
    price: number; // Product price
    image: string; // Product image URL
}[];
  total_price: number;
  status: 'On the Way!' | 'Delivered' | 'Cancelled';
  updatedAt: string;
  createdAt: string;
}

const orderSchema: Schema = new Schema({
  _isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'On the Way!',
  },
  products: [{
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  }],
  total_price: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    updatedAt: true,
  },
  createdAt: {
    type: Date,
    createdAt: true,
  },
});

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
export default OrderModel;
