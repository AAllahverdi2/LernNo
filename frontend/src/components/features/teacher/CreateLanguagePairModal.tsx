import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Button } from '../../common/Button';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { Sparkles } from 'lucide-react';

interface CreateLanguagePairModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: string;
  onSuccess?: (topicName: string, sourceLang: string, targetLang: string) => void;
}

export const CreateLanguagePairModal: React.FC<CreateLanguagePairModalProps> = ({
  isOpen,
  onClose,
  classId = 'class-de-a2',
  onSuccess,
}) => {
  const { addWord, isAdding } = useVocabulary(classId);

  const [topicName, setTopicName] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Alman Dili');
  const [targetLanguage, setTargetLanguage] = useState('Azərbaycan Dili');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      setErrorMessage('Zəhmət olmasa lüğətin adını daxil edin.');
      return;
    }
    setErrorMessage('');

    try {
      // Create initial dictionary entry with selected topic & language pair
      await addWord({
        classId,
        topic: topicName.trim(),
        word: '---', // Initial placeholder entry for empty topic shell
        translation: '---',
        language: sourceLanguage,
        targetLanguage,
        exampleSentence: 'Yeni lüğət yaradıldı',
      });

      if (onSuccess) {
        onSuccess(topicName.trim(), sourceLanguage, targetLanguage);
      }

      setTopicName('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lüğət yaradılarkən xəta baş verdi.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ Yeni Lüğət Və Dil Cütlüyü Yarat"
      description="Lüğətin adını və dil cütlüyünü seçin."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Topic / Dictionary Name */}
        <Input
          label="Lüğətin / Mövzunun Adı *"
          placeholder="Məsələn: Ailə Və Məişət, İş Və Biznes, Səyahət..."
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
        />

        {/* Language Pair Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <Select
            label="Öyrənilən Dil (Mənbə) *"
            options={[
              { value: 'Alman Dili', label: '🇩🇪 Alman Dili' },
              { value: 'İngilis Dili', label: '🇬🇧 İngilis Dili' },
              { value: 'Azərbaycan Dili', label: '🇦🇿 Azərbaycan Dili' },
              { value: 'Rus Dili', label: '🇷🇺 Rus Dili' },
              { value: 'Çex Dili', label: '🇨🇿 Çex Dili' },
              { value: 'Fransız Dili', label: '🇫🇷 Fransız Dili' },
              { value: 'İspan Dili', label: '🇪🇸 İspan Dili' },
              { value: 'İtalyan Dili', label: '🇮🇹 İtalyan Dili' },
              { value: 'Türk Dili', label: '🇹🇷 Türk Dili' },
            ]}
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          />

          <Select
            label="Tərcümə Dili (Hədəf) *"
            options={[
              { value: 'Azərbaycan Dili', label: '🇦🇿 Azərbaycan Dili' },
              { value: 'İngilis Dili', label: '🇬🇧 İngilis Dili' },
              { value: 'Alman Dili', label: '🇩🇪 Alman Dili' },
              { value: 'Rus Dili', label: '🇷🇺 Rus Dili' },
              { value: 'Çex Dili', label: '🇨🇿 Çex Dili' },
              { value: 'Fransız Dili', label: '🇫🇷 Fransız Dili' },
              { value: 'İspan Dili', label: '🇪🇸 İspan Dili' },
              { value: 'İtalyan Dili', label: '🇮🇹 İtalyan Dili' },
              { value: 'Türk Dili', label: '🇹🇷 Türk Dili' },
            ]}
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          />
        </div>

        {/* Language Pair Summary Box */}
        <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs flex items-center justify-between font-bold">
          <span>Seçilmiş Dil Cütlüyü:</span>
          <span className="px-3 py-1 rounded-lg bg-brand-500/20 text-white border border-brand-500/30">
            {sourceLanguage} ➔ {targetLanguage}
          </span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Ləğv Et
          </Button>
          <Button
            type="submit"
            variant="gradient"
            isLoading={isAdding}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Lüğəti Yarat →
          </Button>
        </div>
      </form>
    </Modal>
  );
};
