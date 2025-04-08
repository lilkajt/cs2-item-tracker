import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import listingRouter from './routes/listing.route.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/item', listingRouter);
app.use( (err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(5010, () => {
    connectDB();
    console.log('Server running on http://localhost:5010');
});