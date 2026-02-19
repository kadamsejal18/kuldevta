import express from 'express';
import { login, getMe, createAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login endpoint is active. Use POST /api/auth/login with email and password.',
  });
});
router.get('/me', protect, getMe);
router.post('/create-admin', createAdmin); // Disable after first use

export default router;
