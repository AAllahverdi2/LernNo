import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/classService';
import { useAuth } from '../context/AuthContext';
import type { VocabularyWord } from '../types';

export const useVocabulary = (
  classId?: string,
  params?: { topic?: string; page?: number; limit?: number; search?: string; language?: string; master?: boolean }
) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const vocabQuery = useQuery({
    queryKey: ['vocabulary', classId, params?.topic, params?.page, params?.limit, params?.search, params?.language, params?.master, token],
    queryFn: async () => {
      if (!token || !classId) {
        return { words: [], categories: [], categoriesData: [], languages: [], languagesData: [], total: 0, totalPages: 1 };
      }
      return classService.getVocabulary(token, classId, params);
    },
    enabled: !!token && !!classId,
    staleTime: 1000 * 60 * 5, // 5 minute browser cache window
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const addWordMutation = useMutation({
    mutationFn: (word: Partial<VocabularyWord>) => {
      if (!token || !classId) throw new Error('Token və ya Qrup ID tapılmadı.');
      return classService.addVocabulary(token, classId, word);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });

  const batchAddWordsMutation = useMutation({
    mutationFn: (words: Partial<VocabularyWord>[]) => {
      if (!token || !classId) throw new Error('Token və ya Qrup ID tapılmadı.');
      return classService.batchAddVocabulary(token, classId, words);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Token tapılmadı.');
      return classService.deleteVocabulary(token, id);
    },
    onMutate: async (id: string) => {
      // 1. Cancel outgoing queries for vocabulary so they don't overwrite optimistic state
      await queryClient.cancelQueries({ queryKey: ['vocabulary', classId] });

      // 2. Snapshot previous query data across matching queries
      const previousQueries = queryClient.getQueriesData<{
        words: VocabularyWord[];
        categories: string[];
        categoriesData: { name: string; count: number }[];
        total: number;
        totalPages: number;
      }>({ queryKey: ['vocabulary', classId] });

      // 3. Optimistically remove word from React Query cache immediately (0ms visual delay!)
      queryClient.setQueriesData<{
        words: VocabularyWord[];
        categories: string[];
        categoriesData: { name: string; count: number }[];
        total: number;
        totalPages: number;
      }>({ queryKey: ['vocabulary', classId] }, (old) => {
        if (!old || !old.words) return old;
        const deletedWord = old.words.find((w) => w.id === id);
        const updatedWords = old.words.filter((w) => w.id !== id);
        const updatedTotal = Math.max(0, (old.total || 0) - (deletedWord ? 1 : 0));

        const updatedCategoriesData = old.categoriesData?.map((cat) => {
          if (deletedWord && cat.name === deletedWord.topic) {
            return { ...cat, count: Math.max(0, cat.count - 1) };
          }
          return cat;
        });

        return {
          ...old,
          words: updatedWords,
          total: updatedTotal,
          categoriesData: updatedCategoriesData || old.categoriesData,
        };
      });

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      // Rollback to previous cache snapshot if backend delete fails
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Quiet background refresh without resetting UI loading state
      queryClient.invalidateQueries({
        queryKey: ['vocabulary', classId],
        refetchType: 'none',
      });
      queryClient.invalidateQueries({
        queryKey: ['class', classId],
        refetchType: 'none',
      });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: ({ topic, language, unassignOnly }: { topic: string; language?: string; unassignOnly?: boolean }) => {
      if (!token || !classId) throw new Error('Token və ya Qrup ID tapılmadı.');
      return classService.deleteVocabularyTopic(token, classId, topic, language, unassignOnly);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });

  const words: VocabularyWord[] = vocabQuery.data?.words || [];
  const categories: string[] = vocabQuery.data?.categories || [];
  const categoriesData: { name: string; count: number }[] = vocabQuery.data?.categoriesData || [];
  const languages: string[] = vocabQuery.data?.languages || [];
  const languagesData: { name: string; count: number }[] = vocabQuery.data?.languagesData || [];
  const total: number = vocabQuery.data?.total || 0;
  const totalPages: number = vocabQuery.data?.totalPages || 1;

  return {
    words,
    categories,
    categoriesData,
    languages,
    languagesData,
    total,
    totalPages,
    isLoading: vocabQuery.isLoading,
    addWord: addWordMutation.mutateAsync,
    batchAddWords: batchAddWordsMutation.mutateAsync,
    deleteWord: deleteWordMutation.mutateAsync,
    deleteTopic: deleteTopicMutation.mutateAsync,
    isAdding: addWordMutation.isPending || batchAddWordsMutation.isPending,
  };
};
