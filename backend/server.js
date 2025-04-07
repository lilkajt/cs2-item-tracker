import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use( (err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(5000, () => {
    connectDB();
    console.log('Server running on http://localhost:5000');
});