import { Router } from 'express';
import { createOrder, webhook } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Webhook must use raw body — registered before json middleware in app.ts
router.post('/webhook', webhook);

// Create order + payment intent
router.post('/create-order', protect, createOrder);

export default router;
