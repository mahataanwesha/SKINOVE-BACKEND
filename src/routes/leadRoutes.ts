import express from 'express';
import { createLead, getLeads, updateLeadStatus, deleteLead } from '../controllers/leadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createLead)
  .get(protect, admin, getLeads);

router.route('/:id/status')
  .put(protect, admin, updateLeadStatus);

router.route('/:id')
  .delete(protect, admin, deleteLead);

export default router;
