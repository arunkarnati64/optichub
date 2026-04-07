import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const user = await authService.registerUser(name, email, password);
    res.status(201).json({ message: 'Account created', user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Logged in', user });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.refreshToken as string | undefined;
    if (!token) {
      res.status(401).json({ message: 'No refresh token' });
      return;
    }
    const accessToken = authService.refreshAccessToken(token);
    res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.json({ user: (req as any).user });
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const userId = String((req as any).user._id);
    const user = await authService.updateProfile(userId, data);
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
};
