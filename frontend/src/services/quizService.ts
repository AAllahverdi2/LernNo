import type { Quiz, QuizResult, StudentProgress } from '../types';
import { mockQuiz } from '../data/mockQuizzes';
import { mockStudentProgress } from '../data/mockAnalytics';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const quizService = {
  async getTodayQuiz(): Promise<Quiz> {
    await delay();
    return mockQuiz;
  },

  async submitQuizResult(result: QuizResult): Promise<StudentProgress> {
    await delay(300);
    mockStudentProgress.recentQuizScores.unshift({
      id: `score-${Date.now()}`,
      title: 'Travel & Transportation',
      score: result.percentage,
      date: 'Just now',
    });
    mockStudentProgress.wordsLearned += result.correctWordIds.length;
    mockStudentProgress.dailyLearned = Math.min(10, mockStudentProgress.dailyLearned + result.correctWordIds.length);

    return { ...mockStudentProgress };
  },

  async getStudentProgress(): Promise<StudentProgress> {
    await delay();
    return { ...mockStudentProgress };
  },
};
