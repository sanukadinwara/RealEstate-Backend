import express from 'express';
import { registerUser, authUser, getUserProfile, toggleFavorite, getFavorites, getUsers, socialLogin, forgotPassword, resetPassword, updateUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 
import { toggleFavoriteService, getUserFavorites } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/social-login', socialLogin);
router.get('/profile', protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.route('/favorites/:id').post(protect, toggleFavorite);
router.post('/fav-services/:id', protect, toggleFavoriteService);
router.get('/favorites', protect, getUserFavorites);
router.get('/', protect, admin, getUsers);

export default router;