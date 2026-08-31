import type { User } from '../types';

export const mockTeacherUser: User = {
  id: 'teacher-1',
  name: 'Dr. Markus Weber',
  email: 'teacher@demo.com',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  title: 'Senior German Lecturer & Curriculum Specialist',
  language: 'German',
};

export const mockStudentUser: User = {
  id: 'student-1',
  name: 'Anna Miller',
  email: 'student@demo.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  streak: 7,
  xp: 1420,
  language: 'German A2',
};
