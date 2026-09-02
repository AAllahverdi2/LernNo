import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Button } from '../../common/Button';
import { useVocabulary } from '../../../hooks/useVocabulary';
import type { GermanArticle, DifficultyLevel } from '../../../types';

interface AddVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  defaultLanguage?: string;
}

export const AddVocabularyModal: React.FC<AddVocabularyModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Ümumi',
  defaultLanguage = 'Alman Dili',
}) => {
  const { addWord, isAdding } = useVocabulary();

  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState(defaultLanguage);
  const [article, setArticle] = useState<GermanArticle>('der');
  const [plural, setPlural] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [dayNumber, setDayNumber] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');

  const handleSubmit = async (e: React.FormEvent, status: 'Published' | 'Draft' = 'Published') => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;

    await addWord({
      word,
      translation,
      language,
      article,
      plural,
      exampleSentence,
      topic,
      dayNumber,
      difficulty,
      status,
    });

    setWord('');
    setTranslation('');
    setPlural('');
    setExampleSentence('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Vocabulary Word"
      description="Create a single German word entry with translation, article, and example sentence."
      maxWidth="lg"
    >
      <form onSubmit={(e) => handleSubmit(e, 'Published')} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Select
            label="Article"
            options={[
              { value: 'der', label: 'der (masculine)' },
              { value: 'die', label: 'die (feminine)' },
              { value: 'das', label: 'das (neuter)' },
              { value: '', label: 'None (Verb/Adj)' },
            ]}
            value={article}
            onChange={(e) => setArticle(e.target.value as GermanArticle)}
          />

          <div className="col-span-2">
            <Input
              label="German Word"
              placeholder="e.g. Bahnhof"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Translation (EN/AZ)"
            placeholder="e.g. train station / vağzal"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            required
          />

          <Input
            label="Plural Form"
            placeholder="e.g. die Bahnhöfe"
            value={plural}
            onChange={(e) => setPlural(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select
            label="Dil (Language)"
            options={[
              { value: 'Alman Dili', label: '🇩🇪 Alman Dili' },
              { value: 'İngilis Dili', label: '🇬🇧 İngilis Dili' },
              { value: 'Rus Dili', label: '🇷🇺 Rus Dili' },
              { value: 'Çex Dili', label: '🇨🇿 Çex Dili' },
              { value: 'Fransız Dili', label: '🇫🇷 Fransız Dili' },
              { value: 'İspan Dili', label: '🇪🇸 İspan Dili' },
              { value: 'İtalyan Dili', label: '🇮🇹 İtalyan Dili' },
              { value: 'Türk Dili', label: '🇹🇷 Türk Dili' },
            ]}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <Input
            label="Day Number"
            type="number"
            value={dayNumber}
            onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
          />

          <Input
            label="Topic"
            placeholder="e.g. Travel"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Example Sentence (German)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            placeholder="e.g. Wo ist der nächste Bahnhof?"
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={(e) => handleSubmit(e as any, 'Draft')}>
            Save Draft
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" isLoading={isAdding}>
              Publish Word
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
