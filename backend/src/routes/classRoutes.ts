import { Router } from 'express';
import {
  createClass,
  getTeacherClasses,
  getClassDetail,
  inviteStudentToClass,
  addVocabularyToClass,
  createQuizInClass,
  getMyInvitations,
  respondToInvitation,
} from '../controllers/classController';
import { getStudentsList } from '../controllers/studentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Protect all class routes with JWT authentication
router.use(authenticateToken);

// Students search endpoint for teacher select dropdown
router.get('/students/search', requireRole(['TEACHER', 'ADMIN']), getStudentsList);

// Student invitation endpoints
router.get('/invitations/my-invitations', requireRole(['STUDENT']), getMyInvitations);
router.post('/invitations/:enrollmentId/respond', requireRole(['STUDENT']), respondToInvitation);

// Class management endpoints
router.post('/', requireRole(['TEACHER', 'ADMIN']), createClass);
router.get('/', getTeacherClasses);
router.get('/:classId', getClassDetail);

// Sub-resource endpoints inside a class
router.post('/:classId/invite', requireRole(['TEACHER', 'ADMIN']), inviteStudentToClass);
router.post('/:classId/students', requireRole(['TEACHER', 'ADMIN']), inviteStudentToClass);
router.post('/:classId/vocabulary', requireRole(['TEACHER', 'ADMIN']), addVocabularyToClass);
router.post('/:classId/quizzes', requireRole(['TEACHER', 'ADMIN']), createQuizInClass);

export default router;
