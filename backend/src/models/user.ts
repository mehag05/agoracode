import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  products: mongoose.Types.ObjectId[];
  product_files: mongoose.Types.ObjectId[];
  firstName: string;
  lastName: string;
  deliveryLocation: 'Dorm Room' | 'Off campus residence' | 'Rodin Office' | 'Harrison Office' | 'Harnwell Office' | 'Hill Office'| 'Lauder Office' | 'Guttman Office' | null;
  customLocation: string | null;
  role: 'seller' | 'buyer';
  email: string;
  resetPasswordToken: string | null;
  resetPasswordExpiration: Date | null;
  stripe_account_id: string | null;
  supertokens_id: string;
  password: string;
  verified: boolean;
  verificationToken: string | null;
  loginAttempts: number;
  lockUntil: Date | null;
  agora_fee: Boolean
}

const userSchema = new Schema<IUser>({
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  product_files: [{ type: Schema.Types.ObjectId, ref: 'ProductFile' }],
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  deliveryLocation: {
    type: String,
    enum: ['Dorm Room', 'Off campus residence', 'Rodin Office', 'Harrison Office', 'Harnwell Office', 'Hill Office', 'Lauder Office', 'Guttman Office', ''],
    default: null
  },
  customLocation: { type: String, default: null },
  role: { type: String, enum: ['seller', 'buyer'], required: true },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: String,
  resetPasswordExpiration: Date,
  stripe_account_id: { type: String, default: null },
  supertokens_id: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  agora_fee: { type: Boolean, default: false }
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);