import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../../hooks/useQuiz';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Progress } from '../../common/Progress';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

export const QuizRunner: React.FC = () => {
  const navigate = useNavigate();
  const { quiz, submitQuiz, isLoading } = useQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (isLoading || !quiz) {
    return <div className="p-8 text-center text-slate-400">Loading quiz questions...</div>;
  }

  const currentQuestion = quiz.questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCorrectIds((prev) => [...prev, currentQuestion.wordId]);
    } else {
      setIncorrectIds((prev) => [...prev, currentQuestion.wordId]);
    }
  };

  const handleNext = async () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const percentage = Math.round((correctCount / quiz.questions.length) * 100);
      await submitQuiz({
        quizId: quiz.id,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        percentage,
        correctWordIds: correctIds,
        incorrectWordIds: incorrectIds,
        completedAt: new Date().toISOString(),
      });
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setCorrectIds([]);
    setIncorrectIds([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6 animate-scaleUp">
        <Card className="p-8 text-center border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/60 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white">Quiz Complete!</h2>
            <p className="text-sm text-slate-300 mt-1">{quiz.title}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-bold text-slate-400">Final Score</span>
            <div className="text-5xl font-black text-emerald-400">
              {correctCount} / {quiz.questions.length}
            </div>
            <p className="text-sm font-semibold text-slate-200">Accuracy: {percentage}%</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-left">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold block">✓ Correct Answers</span>
              <span className="text-white text-base font-extrabold">{correctCount} words</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-rose-400 font-bold block">✗ Needs Review</span>
              <span className="text-white text-base font-extrabold">{quiz.questions.length - correctCount} words</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="flex-1" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
              Retake Quiz
            </Button>
            <Button variant="gradient" className="flex-1" onClick={() => navigate('/student/progress')}>
              View My Progress →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 max-w-xs mx-4">
          <Progress
            value={((currentIndex + 1) / quiz.questions.length) * 100}
            label={`Question ${currentIndex + 1} of ${quiz.questions.length}`}
            showValue
            size="sm"
          />
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
          Score: {correctCount}
        </span>
      </div>

      {/* Question Card */}
      <Card className="p-8 border-brand-500/30 bg-slate-900/90 shadow-2xl space-y-6 animate-fadeIn">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            {currentQuestion.type === 'article' ? 'Article Selector' : 'Multiple Choice'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

            let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60';

            if (isAnswered) {
              if (isCorrectAnswer) {
                optionStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10';
              } else if (isSelected) {
                optionStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200 font-bold';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(option)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between ${optionStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Banner */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 animate-scaleUp">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-400" /> Explanation
            </span>
            <p className="text-xs text-slate-300">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next Question Footer */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              variant="gradient"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNext}
            >
              {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
