import express from 'express';
import { recordVisit, getTrafficStats, getPublicStats } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/visit').post(recordVisit); 
router.route('/stats').get(protect, admin, getTrafficStats); 
router.route('/public-stats').get(getPublicStats); 

export default router;