import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadAvatar, uploadPost } from '../config/cloudinary';
import { uploadImage, deleteImage } from '../controllers/uploadController';

const router = Router();

// POST /api/upload/avatar  — multipart, field: "image"
router.post('/avatar', protect, uploadAvatar.single('image'), uploadImage);

// POST /api/upload/post  — multipart, field: "image"
router.post('/post', protect, uploadPost.single('image'), uploadImage);

// DELETE /api/upload/:publicId
router.delete('/:publicId', protect, deleteImage);

export default router;
