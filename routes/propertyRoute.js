import express from 'express';
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
    getPendingProperties, 
    approveProperty
} from '../controllers/propertyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/my-properties').get(protect, getMyProperties);
router.get('/myproperties', protect, getMyProperties);

router.route('/pending').get(protect, admin, getPendingProperties);

router.route('/:id/approve').put(protect, admin, approveProperty);

router.route('/:id')
    .get(getPropertyById)
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

export default router;