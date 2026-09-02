import { Router } from 'express';
import {
  createClass,
  getTeacherClasses,
  getClassDetail,
  updateClass,
  deleteClass,
  inviteStudentToClass,
  removeStudentFromClass,
  addVocabularyToClass,
  getVocabularyByClass,
  batchAddVocabularyToClass,
  deleteVocabularyWord,
  deleteVocabularyTopic,
  assignTopicsToClass,
  getClassAssignments,
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
router.put('/:classId', requireRole(['TEACHER', 'ADMIN']), updateClass);
router.delete('/:classId', requireRole(['TEACHER', 'ADMIN']), deleteClass);

// Sub-resource endpoints inside a class
router.post('/:classId/invite', requireRole(['TEACHER', 'ADMIN']), inviteStudentToClass);
router.post('/:classId/students', requireRole(['TEACHER', 'ADMIN']), inviteStudentToClass);
router.delete('/:classId/students/:studentId', requireRole(['TEACHER', 'ADMIN']), removeStudentFromClass);
router.get('/:classId/vocabulary', getVocabularyByClass);
router.post('/:classId/vocabulary', requireRole(['TEACHER', 'ADMIN']), addVocabularyToClass);
router.post('/:classId/vocabulary/batch', requireRole(['TEACHER', 'ADMIN']), batchAddVocabularyToClass);
router.delete('/:classId/vocabulary/topic', requireRole(['TEACHER', 'ADMIN']), deleteVocabularyTopic);
router.post('/:classId/assignments', requireRole(['TEACHER', 'ADMIN']), assignTopicsToClass);
router.get('/:classId/assignments', getClassAssignments);
router.delete('/vocabulary/:wordId', requireRole(['TEACHER', 'ADMIN']), deleteVocabularyWord);
router.post('/:classId/quizzes', requireRole(['TEACHER', 'ADMIN']), createQuizInClass);

export default router;
