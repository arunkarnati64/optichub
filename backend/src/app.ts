import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// Stripe webhook needs raw body — must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Parsing
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
