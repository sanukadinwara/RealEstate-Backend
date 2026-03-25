import express from 'express';
const router = express.Router();
import { getServices, createService, updateService, deleteService, getServiceById } from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createServiceReview, deleteServiceReview, updateServiceReview } from '../controllers/serviceController.js';

router.route('/')
  .get(getServices) 
  .post(protect, admin, createService); 

router.route('/:id')
  .get(getServiceById)
  .put(protect, updateService)
  .delete(protect, admin, deleteService);

router.route('/:id/reviews')
  .post(protect, createServiceReview);

router.route('/:id/reviews/:reviewId')
  .delete(protect, deleteServiceReview)
  .put(protect, updateServiceReview);  

export default router;