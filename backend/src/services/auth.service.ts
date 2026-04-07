import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';

const signAccessToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15m' });

const signRefreshToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const registerUser = async (name: string, email: string, password: string): Promise<IUser> => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');
  const user = await User.create({ name, email, password });
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw new Error('Invalid credentials');

  const accessToken = signAccessToken(String(user._id));
  const refreshToken = signRefreshToken(String(user._id));

  return { user, accessToken, refreshToken };
};

export const updateProfile = async (
  userId: string,
  data: { name?: string; currentPassword?: string; newPassword?: string }
): Promise<IUser> => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found');

  if (data.name) user.name = data.name;

  if (data.newPassword) {
    if (!data.currentPassword) throw new Error('Current password is required');
    const match = await user.comparePassword(data.currentPassword);
    if (!match) throw new Error('Current password is incorrect');
    user.password = data.newPassword;
  }

  await user.save();
  return user;
};

export const refreshAccessToken = (token: string): string => {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
  return signAccessToken(payload.userId);
};
