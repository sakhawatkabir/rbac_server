import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} from '../controllers/requestController';

const router = Router();

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/all', protect, authorize('Admin'), getAllRequests);
router.put('/:id', protect, authorize('Admin'), updateRequestStatus);

export default router;
