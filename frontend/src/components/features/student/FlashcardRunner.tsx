import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { ArticleBadge, DifficultyBadge } from '../../common/Badge';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const FlashcardRunner: React.FC = () => {
  const navigate = useNavigate();
  const { words, isLoading } = useVocabulary('class-de-a2');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[currentIndex] || words[0];

  // Keyboard shortcut listener (Space to flip, Left/Right to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, words.length]);

  if (isLoading || !currentWord) {
    return <div className="p-8 text-center text-slate-400">Loading flashcards...</div>;
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-brand-300 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30">
          Card {currentIndex + 1} / {words.length}
        </span>

        <Button size="sm" variant="ghost" onClick={() => setIsFlipped(!isFlipped)} leftIcon={<RotateCw className="w-3.5 h-3.5" />}>
          Flip
        </Button>
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full min-h-[380px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div
          className={`w-full h-full min-h-[380px] relative transition-transform duration-500 transform-style-3d rounded-3xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <Card className="absolute inset-0 backface-hidden p-8 sm:p-12 border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/60 shadow-2xl flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center border-b border-slate-800 pb-3 text-xs text-slate-400">
              <span>Day {currentWord.dayNumber} • {currentWord.topic}</span>
              <DifficultyBadge difficulty={currentWord.difficulty} />
            </div>

            <div className="my-auto space-y-4">
              {currentWord.article && <ArticleBadge article={currentWord.article} className="text-sm px-3 py-1" />}
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {currentWord.word}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(`${currentWord.article || ''} ${currentWord.word}`);
                }}
                className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:scale-110 transition-all border border-brand-500/30 inline-flex"
                title="Listen audio"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-400 animate-pulse">Click card or press SPACE to flip</p>
          </Card>

          {/* BACK SIDE */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 p-8 sm:p-12 border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/60 shadow-2xl flex flex-col justify-between items-center text-center">
            <div className="w-full flex justify-between items-center border-b border-slate-800 pb-3 text-xs text-slate-400">
              <span className="text-purple-300 font-bold">Translation & Example</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            <div className="my-auto space-y-4">
              <h3 className="text-3xl font-extrabold text-white capitalize">{currentWord.translation}</h3>
              {currentWord.plural && <p className="text-xs text-slate-400">Plural: {currentWord.plural}</p>}

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 italic max-w-md mx-auto">
                "{currentWord.exampleSentence}"
              </div>
            </div>

            <p className="text-xs text-slate-400">Click to return to German word</p>
          </Card>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          className="flex-1"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <Button
          variant="gradient"
          className="flex-1"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={handleNext}
        >
          Next Card
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-500">
        Keyboard hints: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Space</kbd> Flip • <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">→</kbd> Navigate
      </p>
    </div>
  );
};
