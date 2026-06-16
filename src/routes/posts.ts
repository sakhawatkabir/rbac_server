import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getAllPosts, createPost } from '../controllers/postController';

const router = Router();

router.get('/', protect, getAllPosts);
router.post('/', protect, authorize('Manager', 'Admin'), createPost);

export default router;
