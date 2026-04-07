import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = String((req as any).user._id);
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = String((req as any).user._id);
    const order = await orderService.getOrderById(req.params.id, userId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
