import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
import userRoute from './routes/userRoute.js';
import propertyRoute from './routes/propertyRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import inquiryRoute from './routes/inquiryRoute.js';
import serviceRoute from './routes/serviceRoute.js';
import analyticsRoute from './routes/analyticsRoute.js';
import siteReviewRoute from './routes/siteReviewRoute.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/properties', propertyRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/inquiries', inquiryRoute);
app.use('/api/services', serviceRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/sitereviews', siteReviewRoute);

app.get('/', (req, res) => {
    res.send('Hello! Real Estate API is Running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});