import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { classService } from '../../../services/classService';
import { useAuth } from '../../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Check, ShieldCheck } from 'lucide-react';

interface AssignVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  classNameTitle: string;
  allTopics: { name: string; count: number }[];
}

export const AssignVocabularyModal: React.FC<AssignVocabularyModalProps> = ({
  isOpen,
  onClose,
  classId,
  classNameTitle,
  allTopics = [],
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [topicsList, setTopicsList] = useState<{ name: string; count: number }[]>(allTopics);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentAssignments = async () => {
      if (!token || !classId) return;
      setIsLoading(true);
      try {
        const [assignRes, masterVocab] = await Promise.all([
          classService.getClassAssignments(token, classId),
          classService.getVocabulary(token, classId, { master: true }),
        ]);
        setSelectedTopics(assignRes.assignedTopics || []);
        if (masterVocab?.categoriesData && masterVocab.categoriesData.length > 0) {
          setTopicsList(masterVocab.categoriesData);
        } else if (allTopics.length > 0) {
          setTopicsList(allTopics);
        }
      } catch (err: any) {
        setSelectedTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCurrentAssignments();
    }
  }, [isOpen, token, classId, allTopics]);

  const toggleTopic = (topicName: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    );
  };

  const handleSelectAll = () => {
    setSelectedTopics(topicsList.map((t) => t.name));
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
  };

  const handleSave = async () => {
    if (!token || !classId) return;
    setIsSaving(true);
    setError(null);

    try {
      await classService.assignTopics(token, classId, selectedTopics);
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lüğət təyinatları saxlanılarkən xəta baş verdi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🔒 '${classNameTitle}' Qrupuna Lüğət Təyin Et`}
      description="Bu qrupun tələbələrinin hansı lüğətlərə çıxışı olacağını seçin."
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">
            Seçilib: <strong className="text-brand-300 font-bold">{selectedTopics.length}</strong> / {topicsList.length} lüğət
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-brand-400 hover:text-brand-300 font-semibold"
            >
              Hamısını Seç
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-slate-400 hover:text-slate-300 font-semibold"
            >
              Temizle
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
            Təyinatlar yüklənir...
          </div>
        ) : topicsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Hələ ümumi lüğət bazanızda mövzu yoxdur.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {topicsList.map((topic) => {
              const isChecked = selectedTopics.includes(topic.name);
              return (
                <div
                  key={topic.name}
                  onClick={() => toggleTopic(topic.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-brand-500/10 border-brand-500/40 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-brand-500 border-brand-400 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className={`w-4 h-4 ${isChecked ? 'text-brand-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold">{topic.name}</span>
                    </div>
                  </div>

                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    isChecked
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {topic.count} söz
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Ləğv Et
          </Button>
          <Button
            type="button"
            variant="gradient"
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Təyinatları Saxla →
          </Button>
        </div>
      </div>
    </Modal>
  );
};
