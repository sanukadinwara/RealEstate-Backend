import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';

import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, admin, getInquiries);
router.put('/:id/status', protect, admin, updateInquiryStatus);
router.delete('/:id', protect, admin, deleteInquiry);

export default router;