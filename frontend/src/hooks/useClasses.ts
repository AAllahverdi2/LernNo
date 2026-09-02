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
    staleTime: 1000 * 60 * 2, // Cache classes for 2 minutes to prevent repeated pending fetches
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
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

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token tapılmadı.');
      return classService.deleteClass(token, id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['classes'] });
      const previousClasses = queryClient.getQueryData<any[]>(['classes', token]);

      queryClient.setQueryData<any[]>(['classes', token], (old) => {
        if (!old) return old;
        return old.filter((cls) => cls.id !== id);
      });

      return { previousClasses };
    },
    onError: (_err, _id, context) => {
      if (context?.previousClasses) {
        queryClient.setQueryData(['classes', token], context.previousClasses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'], refetchType: 'none' });
    },
  });

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    isError: classesQuery.isError,
    createClass: createClassMutation.mutateAsync,
    deleteClass: deleteClassMutation.mutateAsync,
    isCreating: createClassMutation.isPending,
    isDeleting: deleteClassMutation.isPending,
  };
};

export const useClassDetail = (classId: string) => {
  const { token } = useAuth();

  const classQuery = useQuery({
    queryKey: ['class', classId, token],
    queryFn: async () => {
      if (!token || !classId) return null;
      const data = await classService.getClassDetail(token, classId);
      if (!data) return null;

      const students = (data.enrollments || []).map((e: any) => ({
        id: e.student?.id || e.id,
        enrollmentId: e.id,
        name: e.student?.name || 'Tələbə',
        email: e.student?.email || '',
        avatar: e.student?.avatar,
        status: e.status === 'ACCEPTED' ? 'Active' : e.status === 'PENDING' ? 'Pending' : 'Inactive',
        wordsLearned: 0,
        quizAverage: 0,
        streak: e.student?.streak || 0,
      }));

      return {
        ...data,
        students,
        studentCount: students.length,
        vocabularyCount: data._count?.vocabularyWords ?? data.vocabularyWords?.length ?? 0,
        averageProgress: 0,
      };
    },
    enabled: !!token && !!classId,
    staleTime: 1000 * 60 * 5, // 5 minute cache window for instant page navigation
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    classDetail: classQuery.data,
    isLoading: classQuery.isLoading,
  };
};
