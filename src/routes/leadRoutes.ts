import express from 'express';
import { createLead, getLeads, updateLeadStatus, deleteLead } from '../controllers/leadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id/status')
  .put(updateLeadStatus);

router.route('/:id')
  .delete(deleteLead);

export default router;
