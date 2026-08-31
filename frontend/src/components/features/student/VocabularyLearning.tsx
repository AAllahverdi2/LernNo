import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Progress } from '../../common/Progress';
import { ArticleBadge, DifficultyBadge } from '../../common/Badge';
import {
  Volume2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const VocabularyLearning: React.FC = () => {
  const navigate = useNavigate();
  const { words, isLoading } = useVocabulary('class-de-a2');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedSet, setLearnedSet] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  if (isLoading || words.length === 0) {
    return <div className="p-8 text-center text-slate-400">Loading lesson words...</div>;
  }

  const currentWord = words[currentIndex];

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = (known: boolean) => {
    if (known) {
      setLearnedSet((prev) => new Set(prev).add(currentWord.id));
    }
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setLearnedSet(new Set());
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6 animate-scaleUp">
        <Card className="p-8 space-y-6 border-brand-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/60 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Lesson Completed! 🎉</h2>
            <p className="text-sm text-slate-300 mt-1">
              You reviewed {words.length} words and mastered {learnedSet.size} items.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Words Mastered:</span>
              <strong className="text-emerald-400">{learnedSet.size} / {words.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy:</span>
              <strong className="text-brand-300">{Math.round((learnedSet.size / words.length) * 100)}%</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="flex-1" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
              Practice Again
            </Button>
            <Button variant="gradient" className="flex-1" onClick={() => navigate('/student/quiz')}>
              Take Today's Quiz →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 max-w-xs mx-4">
          <Progress
            value={((currentIndex + 1) / words.length) * 100}
            label={`Word ${currentIndex + 1} of ${words.length}`}
            showValue
            size="sm"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/student/review')}
        >
          Flashcards
        </Button>
      </div>

      {/* Main Interactive Word Card */}
      <Card className="p-8 sm:p-12 text-center border-brand-500/30 bg-slate-900/90 shadow-2xl relative overflow-hidden space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Day {currentWord.dayNumber} • {currentWord.topic}
          </span>
          <DifficultyBadge difficulty={currentWord.difficulty} />
        </div>

        {/* Word Display Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            {currentWord.article && <ArticleBadge article={currentWord.article} className="text-sm px-3 py-1" />}
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
              {currentWord.word}
            </h1>
            <button
              onClick={() => playAudio(`${currentWord.article || ''} ${currentWord.word}`)}
              className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:scale-110 transition-all border border-brand-500/30"
              title="Listen German Pronunciation"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xl font-bold text-brand-300 capitalize">{currentWord.translation}</p>
          {currentWord.plural && (
            <p className="text-xs text-slate-400 font-medium">Plural: {currentWord.plural}</p>
          )}
        </div>

        {/* Example Sentence Box */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Context Example</span>
          <p className="text-base font-semibold text-slate-100 italic">
            "{currentWord.exampleSentence}"
          </p>
          {currentWord.exampleTranslation && (
            <p className="text-xs text-slate-400">{currentWord.exampleTranslation}</p>
          )}
        </div>

        {/* Learning Decision Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="secondary"
            className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
            leftIcon={<HelpCircle className="w-4 h-4 text-amber-400" />}
            onClick={() => handleNext(false)}
          >
            Need Practice
          </Button>

          <Button
            variant="success"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => handleNext(true)}
          >
            I Know It
          </Button>

          <Button
            variant="outline"
            className="col-span-2 sm:col-span-1"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => handleNext(true)}
          >
            Next Word
          </Button>
        </div>
      </Card>
    </div>
  );
};
