import { Router } from 'express';
import {
  createClass,
  getTeacherClasses,
  getClassDetail,
  addStudentToClass,
  addVocabularyToClass,
  createQuizInClass,
} from '../controllers/classController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Protect all class routes with JWT authentication
router.use(authenticateToken);

// Class management endpoints
router.post('/', requireRole(['TEACHER', 'ADMIN']), createClass);
router.get('/', getTeacherClasses);
router.get('/:classId', getClassDetail);

// Sub-resource endpoints inside a class
router.post('/:classId/students', requireRole(['TEACHER', 'ADMIN']), addStudentToClass);
router.post('/:classId/vocabulary', requireRole(['TEACHER', 'ADMIN']), addVocabularyToClass);
router.post('/:classId/quizzes', requireRole(['TEACHER', 'ADMIN']), createQuizInClass);

export default router;
