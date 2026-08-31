import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyWord } from '../types';

export const useVocabulary = (classId?: string) => {
  const queryClient = useQueryClient();

  const wordsQuery = useQuery({
    queryKey: ['vocabularyWords', classId],
    queryFn: () => vocabularyService.getVocabularyWords(classId),
  });

  const setsQuery = useQuery({
    queryKey: ['vocabularySets', classId],
    queryFn: () => vocabularyService.getVocabularySets(classId),
  });

  const addWordMutation = useMutation({
    mutationFn: (word: Partial<VocabularyWord>) => vocabularyService.addVocabularyWord(word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularyWords'] });
      queryClient.invalidateQueries({ queryKey: ['vocabularySets'] });
    },
  });

  const batchAddWordsMutation = useMutation({
    mutationFn: (words: Partial<VocabularyWord>[]) => vocabularyService.batchAddVocabularyWords(words),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularyWords'] });
      queryClient.invalidateQueries({ queryKey: ['vocabularySets'] });
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (id: string) => vocabularyService.deleteVocabularyWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularyWords'] });
    },
  });

  return {
    words: wordsQuery.data || [],
    sets: setsQuery.data || [],
    isLoading: wordsQuery.isLoading || setsQuery.isLoading,
    addWord: addWordMutation.mutateAsync,
    batchAddWords: batchAddWordsMutation.mutateAsync,
    deleteWord: deleteWordMutation.mutateAsync,
    isAdding: addWordMutation.isPending || batchAddWordsMutation.isPending,
  };
};
