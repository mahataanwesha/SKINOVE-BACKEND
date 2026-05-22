import express from 'express';
import { createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(protect, admin, getAppointments);

router.route('/:id/status')
  .put(protect, admin, updateAppointmentStatus);

router.route('/:id')
  .delete(protect, admin, deleteAppointment);

export default router;
