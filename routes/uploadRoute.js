import express from 'express';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
    }
    
    res.json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path, 
    });
});

export default router;