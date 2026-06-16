import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { getAllUsers, getUserById, updateUserRole, updateUserStatus, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/',                protect, authorize('Admin'), getAllUsers);
router.get('/:id',             protect, authorize('Admin'), getUserById);
router.put('/:id/role',        protect, authorize('Admin'), updateUserRole);
router.put('/:id/status',      protect, authorize('Admin'), updateUserStatus);
router.delete('/:id',          protect, authorize('Admin'), deleteUser);

export default router;
