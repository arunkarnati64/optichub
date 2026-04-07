import { env } from '../config/env';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { sendOrderConfirmation } from './email.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const StripeLib = require('stripe');
const stripe = new StripeLib(env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (
  orderId: string,
  items: { name: string; price: number; quantity: number; image?: string }[],
  total: number,
  shippingCost: number
): Promise<string> => {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        ...(item.image ? { images: [item.image] } : {}),
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // Add shipping as a line item if applicable
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    metadata: { orderId },
    success_url: `${env.CLIENT_URL}/orders/${orderId}?success=true`,
    cancel_url: `${env.CLIENT_URL}/cart?cancelled=true`,
  });

  return session.url;
};

export const handleWebhook = async (payload: Buffer, signature: string): Promise<void> => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findByIdAndUpdate(orderId, { status: 'paid' }, { new: true });
      if (order) {
        const user = await User.findById(order.user);
        if (user) {
          await sendOrderConfirmation(
            user.email,
            user.name,
            String(order._id),
            order.items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
            order.subtotal,
            order.shippingCost,
            order.total,
            order.shippingAddress
          );
        }
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { status: 'cancelled' });
    }
  }
};
