import { Router } from 'express';
import { getAllUsers, changeUserRole, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes with JWT authentication & ADMIN role requirement
router.use(authenticateToken, requireRole(['ADMIN']));

router.get('/users', getAllUsers);
router.post('/change-role', changeUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
