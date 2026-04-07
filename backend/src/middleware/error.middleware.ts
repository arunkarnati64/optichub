import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Known operational errors (thrown as plain Error with message)
  if (err instanceof Error) {
    const statusMap: Record<string, number> = {
      'Email already in use': 409,
      'Invalid credentials': 401,
      'No refresh token': 401,
    };
    const status = statusMap[err.message] ?? 500;
    res.status(status).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};
