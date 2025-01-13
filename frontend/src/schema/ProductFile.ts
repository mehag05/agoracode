import mongoose, { Schema, Document } from 'mongoose';

export interface IProductFile extends Document {
  user: string;
  url: string; // Store the cloud storage URL here
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productFileSchema: Schema = new Schema({
  user: { type: String, required: true },
  url: { type: String, required: true }, // Ensure this is required as it will store the file URL
  filename: { type: String, required: true },
  mimeType: { type: String },
  filesize: { type: Number },
  width: { type: Number },
  height: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductFileModel = mongoose.model<IProductFile>('ProductFile', productFileSchema);
export default ProductFileModel;
