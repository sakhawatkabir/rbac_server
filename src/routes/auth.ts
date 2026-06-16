import { Router } from 'express';
import { protect } from '../middleware/auth';
import { signup, login, getMe } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
