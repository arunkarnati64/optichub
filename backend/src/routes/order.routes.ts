import { Router } from 'express';
import { getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
