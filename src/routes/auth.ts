import { Router } from 'express';
import { protect } from '../middleware/auth';
import { signup, login, getMe, updateProfile } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
