import express from 'express';
import {
  createLead,
  getAllLeads,
  getLeadsByProperty,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createLead);

// Admin routes
router.get('/', protect, getAllLeads);
router.get('/stats', protect, getLeadStats);
router.get('/property/:propertyId', protect, getLeadsByProperty);
router.put('/:id', protect, updateLeadStatus);
router.delete('/:id', protect, deleteLead);

export default router;
