import type { StudentProgress, TeacherAnalytics } from '../types';
import { mockStudents } from './mockClasses';
import { mockVocabularyWords } from './mockVocabulary';

export const mockStudentProgress: StudentProgress = {
  wordsLearned: 342,
  wordsMastered: 217,
  wordsToReview: 48,
  currentStreak: 7,
  dailyGoal: 10,
  dailyLearned: 7,
  weeklyActivity: [
    { day: 'Mon', wordsCount: 12, minutes: 25 },
    { day: 'Tue', wordsCount: 15, minutes: 30 },
    { day: 'Wed', wordsCount: 8, minutes: 18 },
    { day: 'Thu', wordsCount: 14, minutes: 28 },
    { day: 'Fri', wordsCount: 20, minutes: 40 },
    { day: 'Sat', wordsCount: 10, minutes: 20 },
    { day: 'Sun', wordsCount: 7, minutes: 15 },
  ],
  masteryBreakdown: [
    { level: 'Mastered', count: 217 },
    { level: 'Learning', count: 77 },
    { level: 'Needs Review', count: 48 },
  ],
  recentQuizScores: [
    { id: 'qz-1', title: 'Travel & Transportation', score: 90, date: 'Today' },
    { id: 'qz-2', title: 'Shopping & Food', score: 85, date: '2 days ago' },
    { id: 'qz-3', title: 'Family & Home', score: 95, date: '5 days ago' },
    { id: 'qz-4', title: 'Greetings & Basics', score: 100, date: '1 week ago' },
  ],
  wordsNeedingReview: mockVocabularyWords.filter(w => ['w8', 'w11', 'w15', 'w10'].includes(w.id)),
};

export const mockTeacherAnalytics: TeacherAnalytics = {
  completionRate: 78.5,
  vocabularyMastery: 82.0,
  quizPerformanceAverage: 86.4,
  studentsNeedingHelpCount: 5,
  dailyActiveStudents: [
    { day: 'Mon', activeCount: 38 },
    { day: 'Tue', activeCount: 36 },
    { day: 'Wed', activeCount: 39 },
    { day: 'Thu', activeCount: 35 },
    { day: 'Fri', activeCount: 40 },
    { day: 'Sat', activeCount: 28 },
    { day: 'Sun', activeCount: 31 },
  ],
  hardestWords: [
    { word: 'Unterkunft', article: 'die', translation: 'accommodation', failureRate: 48, topic: 'Travel' },
    { word: 'Verspätung', article: 'die', translation: 'delay', failureRate: 42, topic: 'Travel' },
    { word: 'Fahrkarte', article: 'die', translation: 'ticket', failureRate: 35, topic: 'Travel' },
    { word: 'Höflichkeit', article: 'die', translation: 'politeness', failureRate: 31, topic: 'Greetings' },
    { word: 'günstig', article: '', translation: 'cheap', failureRate: 28, topic: 'Shopping' },
  ],
  studentRoster: mockStudents,
};
