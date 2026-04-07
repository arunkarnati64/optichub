import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripePaymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    stripePaymentIntentId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
