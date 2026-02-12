import express from 'express';
import { login, getMe, createAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/create-admin', createAdmin); // Disable after first use

export default router;
