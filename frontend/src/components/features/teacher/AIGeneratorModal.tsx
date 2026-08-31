import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { ArticleBadge, DifficultyBadge } from '../../common/Badge';
import { aiService } from '../../../services/aiService';
import { useVocabulary } from '../../../hooks/useVocabulary';
import type { VocabularyWord, CEFRLevel, DifficultyLevel } from '../../../types';
import {
  Sparkles,
  Check,
  RefreshCw,
  Trash2,
  Wand2,
} from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { batchAddWords } = useVocabulary();

  const [prompt, setPrompt] = useState('Create 10 A2 German words about travelling and airport procedures.');
  const [topic] = useState('Travel');
  const [language, setLanguage] = useState('German');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [generatedWords, setGeneratedWords] = useState<Partial<VocabularyWord>[] | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingStep('Connecting to AI language model...');
    
    setTimeout(() => setLoadingStep('Extracting CEFR level vocabulary & articles...'), 500);
    setTimeout(() => setLoadingStep('Generating natural example sentences in German...'), 1000);

    try {
      const results = await aiService.generateVocabulary({
        topic,
        language,
        level,
        wordCount,
        difficulty,
        customPrompt: prompt,
      });
      setGeneratedWords(results);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveWord = (index: number) => {
    if (!generatedWords) return;
    setGeneratedWords(generatedWords.filter((_, i) => i !== index));
  };

  const handleAddToLesson = async () => {
    if (!generatedWords || generatedWords.length === 0) return;
    await batchAddWords(
      generatedWords.map((w) => ({
        ...w,
        status: 'Published',
      }))
    );
    setGeneratedWords(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Vocabulary Generator"
      description="Leverage Lexora AI to craft tailored vocabulary sets with articles, plurals, and contextual example sentences."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Step 1: Prompt & Controls */}
        {!generatedWords && !isGenerating && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-400" />
                What should your students learn today?
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                placeholder="e.g. Create 10 A2 German words about travelling, train station tickets, and airport procedures..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <Select
                label="Language"
                options={[{ value: 'German', label: 'German' }]}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
              <Select
                label="CEFR Level"
                options={[
                  { value: 'A1', label: 'A1' },
                  { value: 'A2', label: 'A2' },
                  { value: 'B1', label: 'B1' },
                  { value: 'B2', label: 'B2' },
                  { value: 'C1', label: 'C1' },
                ]}
                value={level}
                onChange={(e) => setLevel(e.target.value as CEFRLevel)}
              />
              <Input
                label="Word Count"
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value) || 5)}
              />
              <Select
                label="Difficulty"
                options={[
                  { value: 'Easy', label: 'Easy' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Hard', label: 'Hard' },
                ]}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={handleGenerate}
              >
                Generate Vocabulary
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Generating AI Vocabulary...</h4>
              <p className="text-xs text-purple-300 mt-1 animate-pulse">{loadingStep}</p>
            </div>
          </div>
        )}

        {/* Step 2: Generated Results Preview */}
        {generatedWords && !isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Generated {generatedWords.length} words for topic "{topic}" ({level}).</span>
              </div>
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleGenerate}>
                Regenerate
              </Button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {generatedWords.map((word, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <ArticleBadge article={word.article as any} />
                      <strong className="text-white text-sm">{word.word}</strong>
                      <span className="text-slate-400 text-xs">— {word.translation}</span>
                      <DifficultyBadge difficulty={word.difficulty as any} />
                    </div>
                    {word.plural && <p className="text-[11px] text-slate-400">Plural: {word.plural}</p>}
                    <p className="text-xs text-slate-300 italic">"{word.exampleSentence}"</p>
                  </div>
                  <button
                    onClick={() => handleRemoveWord(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setGeneratedWords(null)}>
                Back to Controls
              </Button>
              <Button
                variant="gradient"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={handleAddToLesson}
              >
                Add {generatedWords.length} Words to Today's Lesson
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
