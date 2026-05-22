import express from 'express';
import { authUser, getUserProfile, seedAdmin } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.post('/seed', seedAdmin); // One-time use endpoint to seed admin
router.get('/me', protect, getUserProfile);

export default router;
