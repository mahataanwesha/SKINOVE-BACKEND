import express from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, admin, createTestimonial);

router.route('/:id')
  .delete(protect, admin, deleteTestimonial);

export default router;
