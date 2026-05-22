import express from 'express';
import { createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment } from '../controllers/appointmentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.route('/:id/status')
  .put(updateAppointmentStatus);

router.route('/:id')
  .delete(deleteAppointment);

export default router;
