import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/classService';
import type { ClassItem } from '../types';

export const useClasses = () => {
  const queryClient = useQueryClient();

  const classesQuery = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getClasses(),
  });

  const createClassMutation = useMutation({
    mutationFn: (newClass: Partial<ClassItem>) => classService.createClass(newClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    isError: classesQuery.isError,
    createClass: createClassMutation.mutateAsync,
    isCreating: createClassMutation.isPending,
  };
};

export const useClassDetail = (classId: string) => {
  const classQuery = useQuery({
    queryKey: ['class', classId],
    queryFn: () => classService.getClassById(classId),
    enabled: !!classId,
  });

  const lessonSummaryQuery = useQuery({
    queryKey: ['lessonSummary', classId],
    queryFn: () => classService.getTodayLessonSummary(classId),
    enabled: !!classId,
  });

  return {
    classDetail: classQuery.data,
    isLoading: classQuery.isLoading,
    lessonSummary: lessonSummaryQuery.data,
  };
};
