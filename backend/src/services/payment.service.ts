import Stripe from 'stripe';
import { env } from '../config/env';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { sendOrderConfirmation } from './email.service';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (
  amount: number,
  orderId: string
): Promise<string> => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: 'usd',
    metadata: { orderId },
  });
  return paymentIntent.client_secret!;
};

export const handleWebhook = async (payload: Buffer, signature: string): Promise<void> => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.orderId;
    if (orderId) {
      const order = await Order.findByIdAndUpdate(orderId, { status: 'paid' }, { new: true });
      if (order) {
        const user = await User.findById(order.user);
        if (user) {
          await sendOrderConfirmation(
            user.email,
            user.name,
            String(order._id),
            order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
            order.subtotal,
            order.shippingCost,
            order.total,
            order.shippingAddress
          );
        }
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { status: 'cancelled' });
    }
  }
};
