import React, { useState } from 'react';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { Button } from '../../common/Button';
import { ArticleBadge, DifficultyBadge, StatusBadge } from '../../common/Badge';
import { Input } from '../../common/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { AddVocabularyModal } from './AddVocabularyModal';
import { BatchImportModal } from './BatchImportModal';
import {
  Plus,
  Sparkles,
  Volume2,
  Trash2,
  Edit,
  Search,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface VocabularyManagerProps {
  classId?: string;
}

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({ classId = 'class-de-a2' }) => {
  const { words, deleteWord } = useVocabulary(classId);
  const { openAIGenerator } = useOutletContext<{ openAIGenerator: () => void }>() || {};

  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Web Speech API text-to-speech
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const daysList = Array.from(new Set(words.map((w) => w.dayNumber))).sort((a, b) => a - b);

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase()) ||
      w.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDay = selectedDay === 'all' || w.dayNumber === selectedDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Vocabulary Sets by Day & Topic
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Organize daily words, add translations, example sentences, and publish lessons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
            onClick={() => setIsBatchOpen(true)}
          >
            Batch Import
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWordOpen(true)}
          >
            Add Word
          </Button>
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={openAIGenerator}
          >
            Generate with AI
          </Button>
        </div>
      </div>

      {/* Filter and Day Selector Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search German word, translation, topic..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedDay === 'all'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Days ({words.length})
          </button>
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day & Topic</TableHead>
            <TableHead>Article & Word</TableHead>
            <TableHead>Translation</TableHead>
            <TableHead>Plural</TableHead>
            <TableHead>Example Sentence</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWords.map((word) => (
            <TableRow key={word.id}>
              <TableCell>
                <span className="font-semibold text-slate-300 text-xs block">Day {word.dayNumber}</span>
                <span className="text-[10px] text-brand-400 font-medium">{word.topic}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ArticleBadge article={word.article} />
                  <span className="font-extrabold text-white text-sm">{word.word}</span>
                  <button
                    onClick={() => playAudio(`${word.article || ''} ${word.word}`)}
                    className="p-1 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                    title="Listen pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="font-medium text-slate-200">{word.translation}</TableCell>
              <TableCell className="text-xs text-slate-400">{word.plural || '—'}</TableCell>
              <TableCell className="max-w-xs">
                <p className="text-xs italic text-slate-300 truncate">"{word.exampleSentence}"</p>
                {word.exampleTranslation && (
                  <p className="text-[10px] text-slate-500 truncate">{word.exampleTranslation}</p>
                )}
              </TableCell>
              <TableCell>
                <DifficultyBadge difficulty={word.difficulty} />
              </TableCell>
              <TableCell>
                <StatusBadge status={word.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddVocabularyModal isOpen={isAddWordOpen} onClose={() => setIsAddWordOpen(false)} />
      <BatchImportModal isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />
    </div>
  );
};
