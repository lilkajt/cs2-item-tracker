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
    let message = "Whoops, something broke! Try again in a minute.";
    if (err.name === "TypeError") {
        message = "Oops! Looks like we didn't get your input right. Please double-check and try again!";
    } else if (err.name === "ValidationError") {
        message = "Hmm, we couldn't make sense of some of the data. Give it another go, making sure everything is in order!";
    } else if (err.statusCode && err.statusCode < 500) {
        message = err.message;
    }
    if (statusCode >= 500){
        console.log('Server error: ', err);
    }
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    });
});

app.listen(5010, () => {
    connectDB();
    console.log('Server running on http://localhost:5010');
});