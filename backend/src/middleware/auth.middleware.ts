import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.accessToken as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  if (user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};
