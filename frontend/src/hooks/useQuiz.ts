import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '../services/quizService';
import type { QuizResult } from '../types';

export const useQuiz = () => {
  const queryClient = useQueryClient();

  const quizQuery = useQuery({
    queryKey: ['todayQuiz'],
    queryFn: () => quizService.getTodayQuiz(),
  });

  const progressQuery = useQuery({
    queryKey: ['studentProgress'],
    queryFn: () => quizService.getStudentProgress(),
  });

  const submitQuizMutation = useMutation({
    mutationFn: (result: QuizResult) => quizService.submitQuizResult(result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProgress'] });
    },
  });

  return {
    quiz: quizQuery.data,
    progress: progressQuery.data,
    isLoading: quizQuery.isLoading || progressQuery.isLoading,
    submitQuiz: submitQuizMutation.mutateAsync,
    isSubmitting: submitQuizMutation.isPending,
  };
};
