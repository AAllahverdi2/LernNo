import type { ClassItem, LessonSummary } from '../types';
import { mockClasses } from '../data/mockClasses';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let localClasses = [...mockClasses];

export const classService = {
  async getClasses(): Promise<ClassItem[]> {
    await delay();
    return [...localClasses];
  },

  async getClassById(classId: string): Promise<ClassItem | undefined> {
    await delay();
    return localClasses.find((c) => c.id === classId);
  },

  async createClass(newClass: Partial<ClassItem>): Promise<ClassItem> {
    await delay(300);
    const created: ClassItem = {
      id: `class-${Date.now()}`,
      name: newClass.name || 'New Class',
      language: newClass.language || 'German',
      level: newClass.level || 'A2',
      teacherId: 'teacher-1',
      studentCount: 0,
      vocabularyCount: 0,
      averageProgress: 0,
      lastActivity: 'Just now',
      description: newClass.description || '',
      students: [],
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    };
    localClasses = [created, ...localClasses];
    return created;
  },

  async getTodayLessonSummary(classId: string): Promise<LessonSummary> {
    await delay();
    const cls = localClasses.find((c) => c.id === classId) || localClasses[0];
    return {
      classId: cls.id,
      className: cls.name,
      dayNumber: 4,
      topic: 'Travel & Transportation',
      newWordsCount: 10,
      reviewWordsCount: 15,
      quizQuestionsCount: 10,
      completedStudentsCount: 28,
      totalStudentsCount: cls.studentCount || 40,
      isPublished: true,
    };
  },
};
