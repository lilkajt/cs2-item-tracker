import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createItem } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createItem);
export default router;