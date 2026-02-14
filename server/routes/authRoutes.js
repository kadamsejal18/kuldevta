import express from 'express';
import { login, getMe, createAdmin, resetAdminPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/login', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Use POST /api/auth/login for admin authentication',
  });
});
router.get('/me', protect, getMe);
router.post('/create-admin', createAdmin); // Disable after first use
router.post('/reset-password', resetAdminPassword); // Emergency recovery via setup key

export default router;
