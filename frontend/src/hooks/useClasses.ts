import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/classService';
import type { CreateClassPayload } from '../services/classService';
import { useAuth } from '../context/AuthContext';

export const useClasses = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const classesQuery = useQuery({
    queryKey: ['classes', token],
    queryFn: async () => {
      if (!token) return [];
      const apiClasses = await classService.getTeacherClasses(token);
      return apiClasses.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        language: cls.language,
        level: cls.level,
        schedule: cls.schedule || '1-3-5 Saat 14:00',
        description: cls.description || '',
        studentCount: cls._count?.enrollments || 0,
        vocabularyCount: cls._count?.vocabularyWords || 0,
        averageProgress: 0,
        lastActivity: 'Aktiv',
      }));
    },
    enabled: !!token,
  });

  const createClassMutation = useMutation({
    mutationFn: (newClass: CreateClassPayload) => {
      if (!token) throw new Error('Token tapılmadı.');
      return classService.createClass(token, newClass);
    },
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
  const { token } = useAuth();

  const classQuery = useQuery({
    queryKey: ['class', classId, token],
    queryFn: async () => {
      if (!token || !classId) return null;
      return classService.getClassDetail(token, classId);
    },
    enabled: !!token && !!classId,
  });

  return {
    classDetail: classQuery.data,
    isLoading: classQuery.isLoading,
  };
};
