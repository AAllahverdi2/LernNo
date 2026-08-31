import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AIGeneratorModal } from '../components/features/teacher/AIGeneratorModal';
import { Sparkles, Wand2, BookOpen, BrainCircuit } from 'lucide-react';

export const TeacherAIToolsPage: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-purple-400" />
          Lexora AI Creator Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automate vocabulary set creation, contextual example sentence generation, and adaptive quiz question creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect className="p-6 border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Wand2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Vocabulary Generator</h3>
          <p className="text-xs text-slate-300">
            Provide a topic prompt (e.g., "10 A2 German words about dining out"), and AI generates words with articles, plurals, and sentences.
          </p>
          <Button variant="gradient" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => setIsAIOpen(true)}>
            Open AI Generator
          </Button>
        </Card>

        <Card hoverEffect className="p-6 border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/40 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Example Sentence Enhancer</h3>
          <p className="text-xs text-slate-300">
            Automatically craft beginner or intermediate example sentences tailored to your class's current level.
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setIsAIOpen(true)}>
            Enhance Sentences
          </Button>
        </Card>

        <Card hoverEffect className="p-6 border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Auto-Quiz Constructor</h3>
          <p className="text-xs text-slate-300">
            Convert existing vocabulary sets into multiple choice and article identification quizzes instantly.
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setIsAIOpen(true)}>
            Construct Quiz
          </Button>
        </Card>
      </div>

      <AIGeneratorModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
