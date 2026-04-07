import { Order, IShippingAddress } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { createPaymentIntent } from './payment.service';
import { sendOrderConfirmation, sendStatusUpdate } from './email.service';

interface CartItem {
  productId: string;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  shippingAddress: IShippingAddress
) => {
  // Validate products and calculate totals
  const items = await Promise.all(
    cartItems.map(async ({ productId, quantity }) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product not found: ${productId}`);
      if (product.stock < quantity) throw new Error(`Insufficient stock for ${product.name}`);
      return {
        product: product._id,
        name: product.name,
        image: product.images[0] ?? '',
        price: product.price,
        quantity,
      };
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Create order with pending status
  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
    status: 'pending',
  });

  // Create Stripe payment intent
  const clientSecret = await createPaymentIntent(total, String(order._id));

  // Send confirmation email immediately
  const user = await User.findById(userId);
  if (user) {
    await sendOrderConfirmation(
      user.email,
      user.name,
      String(order._id),
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      subtotal,
      shippingCost,
      total,
      shippingAddress
    );
  }

  return { order, clientSecret };
};

export const getOrdersByUser = async (userId: string) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string, userId: string) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error('Order not found');
  return order;
};

export const getAllOrders = async () => {
  return Order.find().populate('user', 'name email').sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) throw new Error('Order not found');

  const user = await User.findById(order.user);
  if (user) {
    await sendStatusUpdate(user.email, user.name, String(order._id), status);
  }

  return order;
};
