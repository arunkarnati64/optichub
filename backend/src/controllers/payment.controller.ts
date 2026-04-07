import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as orderService from '../services/order.service';
import * as paymentService from '../services/payment.service';

const shippingSchema = z.object({
  fullName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().min(2),
});

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number(),
});

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cartItems, shippingAddress } = z.object({
      cartItems: z.array(cartItemSchema).min(1),
      shippingAddress: shippingSchema,
    }).parse(req.body);

    const userId = String((req as any).user._id);
    const { order, clientSecret } = await orderService.createOrder(userId, cartItems, shippingAddress);

    res.status(201).json({ order, clientSecret });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    await paymentService.handleWebhook(req.body as Buffer, signature);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
