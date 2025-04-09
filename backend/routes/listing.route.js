import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createItem, deleteItem } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createItem);
router.delete('/delete/:id', verifyUser, deleteItem);

export default router;