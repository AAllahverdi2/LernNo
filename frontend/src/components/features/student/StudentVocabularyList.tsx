import React, { useState } from 'react';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { Input } from '../../common/Input';
import { ArticleBadge, DifficultyBadge } from '../../common/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { Search, Volume2, BookOpen } from 'lucide-react';

export const StudentVocabularyList: React.FC = () => {
  const { words } = useVocabulary('class-de-a2');
  const [search, setSearch] = useState('');

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase()) ||
      w.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-brand-400" />
          My Class Vocabulary
        </h1>
        <p className="text-slate-400 text-xs mt-1">Browse all German vocabulary taught in your class.</p>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search vocabulary words or translations..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>German Word</TableHead>
            <TableHead>Translation</TableHead>
            <TableHead>Plural</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Example Sentence</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Audio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWords.map((word) => (
            <TableRow key={word.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ArticleBadge article={word.article} />
                  <span className="font-extrabold text-white text-sm">{word.word}</span>
                </div>
              </TableCell>
              <TableCell className="font-semibold text-slate-200">{word.translation}</TableCell>
              <TableCell className="text-xs text-slate-400">{word.plural || '—'}</TableCell>
              <TableCell className="text-xs text-brand-300 font-medium">{word.topic}</TableCell>
              <TableCell className="max-w-xs text-xs italic text-slate-300">"{word.exampleSentence}"</TableCell>
              <TableCell>
                <DifficultyBadge difficulty={word.difficulty} />
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => playAudio(`${word.article || ''} ${word.word}`)}
                  className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
