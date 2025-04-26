import express from 'express';
import { signup, signin, logout, verify } from '../controllers/auth.controller.js';
import { verifyUser } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/logout', logout);
router.get('/verify',verifyUser ,verify);

export default router;