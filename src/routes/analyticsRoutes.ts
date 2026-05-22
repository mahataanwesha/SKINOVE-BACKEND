import express from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getAnalytics);

export default router;
