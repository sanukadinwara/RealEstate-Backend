import express from 'express';
import { getSiteReviews, createSiteReview, deleteSiteReview, updateSiteReview } from '../controllers/siteReviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSiteReviews)
  .post(protect, createSiteReview);

router.route('/:id')
  .delete(protect, deleteSiteReview)
  .put(protect, updateSiteReview);

export default router;