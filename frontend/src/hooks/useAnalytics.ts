import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const analyticsQuery = useQuery({
    queryKey: ['teacherAnalytics'],
    queryFn: () => analyticsService.getTeacherAnalytics(),
  });

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
  };
};
