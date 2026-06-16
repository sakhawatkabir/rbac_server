import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';

const router = Router();

router.get('/',     protect, getAllPosts);
router.get('/:id',  protect, getPostById);
router.post('/',    protect, authorize('Manager', 'Admin'), createPost);
router.put('/:id',  protect, authorize('Manager', 'Admin'), updatePost);
router.delete('/:id', protect, authorize('Manager', 'Admin'), deletePost);

export default router;
