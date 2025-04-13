import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createItem,updateItem, deleteItem, getItems, getItem } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createItem);
router.get('', verifyUser, getItems);
router.get('/:id', verifyUser, getItem);
router.put('/update/:id', verifyUser, updateItem);
router.delete('/delete/:id', verifyUser, deleteItem);

export default router;