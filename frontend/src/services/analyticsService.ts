import type { TeacherAnalytics } from '../types';
import { mockTeacherAnalytics } from '../data/mockAnalytics';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsService = {
  async getTeacherAnalytics(): Promise<TeacherAnalytics> {
    await delay();
    return { ...mockTeacherAnalytics };
  },
};
