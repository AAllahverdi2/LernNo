import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { FileText, Table as TableIcon, Sparkles, CheckCircle, AlertCircle, Trash2, Plus } from 'lucide-react';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  existingTopics?: string[];
  defaultTopic?: string;
  onSuccess?: () => void;
}

interface ParsedWord {
  id: string;
  article: string;
  word: string;
  translation: string;
  plural: string;
  exampleSentence: string;
  topic: string;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  classId,
  existingTopics = [],
  defaultTopic,
  onSuccess,
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [activeMode, setActiveMode] = useState<'paste' | 'table'>('paste');
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic || existingTopics[0] || '');
  const [selectedLanguage, setSelectedLanguage] = useState('Alman Dili');
  const [customTopic, setCustomTopic] = useState('');
  const [isNewTopic, setIsNewTopic] = useState(!defaultTopic && existingTopics.length === 0);

  useEffect(() => {
    if (defaultTopic) {
      setSelectedTopic(defaultTopic);
      setIsNewTopic(false);
    } else if (existingTopics.length === 0) {
      setIsNewTopic(true);
    } else {
      setSelectedTopic(existingTopics[0]);
    }
  }, [defaultTopic, existingTopics]);

  // Default raw text sample
  const [rawText, setRawText] = useState(
`der Hund - it
die Katze - pişik
das Haus - ev
der Apfel - alma
die Hand - əl
der Kopf - baş`
  );

  // Parsed / Table rows state
  const [parsedRows, setParsedRows] = useState<ParsedWord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto Parser Logic
  const handleParseText = () => {
    setError(null);
    if (!rawText.trim()) {
      setError('Zəhmət olmasa kopyalanmış sözlər siyahısını daxil edin.');
      return;
    }

    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: ParsedWord[] = [];
    const topicToUse = isNewTopic && customTopic.trim() ? customTopic.trim() : (selectedTopic || 'Ümumi');

    lines.forEach((line, index) => {
      // Split by common separators: -, —, :, =, \t, ;
      const match = line.split(/[-—:=\t;]/);
      if (match.length >= 2) {
        let rawWordPart = match[0].trim();
        let translationPart = match.slice(1).join(' ').trim();

        // Extract German articles (der / die / das)
        let article = '';
        const articleMatch = rawWordPart.match(/^(der|die|das)\s+/i);
        if (articleMatch) {
          article = articleMatch[1].toLowerCase();
          rawWordPart = rawWordPart.replace(/^(der|die|das)\s+/i, '').trim();
        }

        if (rawWordPart && translationPart) {
          parsed.push({
            id: `${Date.now()}-${index}`,
            article,
            word: rawWordPart,
            translation: translationPart,
            plural: '',
            exampleSentence: '',
            topic: topicToUse,
          });
        }
      }
    });

    if (parsed.length === 0) {
      setError('Sözlər ayırd edilə bilmədi. Söz və tərcümə arasında tire (-) və ya iki nöqtə (:) qoyun.');
    } else {
      setParsedRows(parsed);
      setSuccessMessage(`${parsed.length} söz uğurla təhlil olundu və hazırlandı!`);
    }
  };

  const handleUpdateRow = (id: string, field: keyof ParsedWord, val: string) => {
    setParsedRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const handleRemoveRow = (id: string) => {
    setParsedRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddEmptyRow = () => {
    const topicToUse = isNewTopic && customTopic.trim() ? customTopic.trim() : (selectedTopic || 'Ümumi');
    setParsedRows((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        article: 'der',
        word: '',
        translation: '',
        plural: '',
        exampleSentence: '',
        topic: topicToUse,
      },
    ]);
  };

  const handleParseAndSaveDirectly = async () => {
    setError(null);
    if (!rawText.trim()) {
      setError('Zəhmət olmasa kopyalanmış sözlər siyahısını daxil edin.');
      return;
    }
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: any[] = [];
    const topicToUse = isNewTopic && customTopic.trim() ? customTopic.trim() : (selectedTopic || 'Ümumi');

    lines.forEach((line) => {
      const match = line.split(/[-—:=\t;]/);
      if (match.length >= 2) {
        let rawWordPart = match[0].trim();
        let translationPart = match.slice(1).join(' ').trim();
        let article = '';
        const articleMatch = rawWordPart.match(/^(der|die|das)\s+/i);
        if (articleMatch) {
          article = articleMatch[1].toLowerCase();
          rawWordPart = rawWordPart.replace(/^(der|die|das)\s+/i, '').trim();
        }
        if (rawWordPart && translationPart) {
          parsed.push({
            word: rawWordPart,
            translation: translationPart,
            article,
            plural: '',
            language: selectedLanguage,
            exampleSentence: `${article ? article + ' ' : ''}${rawWordPart} - ${translationPart}`,
            topic: topicToUse,
          });
        }
      }
    });

    if (parsed.length === 0) {
      setError('Sözlər ayırd edilə bilmədi. Söz və tərcümə arasında tire (-) və ya iki nöqtə (:) qoyun.');
      return;
    }

    if (!token || !classId) return;
    setIsSaving(true);
    try {
      await classService.batchAddVocabulary(token, classId, parsed);
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Sözlər daxil edilərkən xəta baş verdi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!token || !classId) return;
    const finalTopic = isNewTopic && customTopic.trim() ? customTopic.trim() : (selectedTopic || 'Ümumi');
    const validWords = parsedRows.filter((r) => r.word.trim() && r.translation.trim());

    if (validWords.length === 0) {
      setError('Yadda saxlamaq üçün ən azı 1 tam söz daxil edilməlidir.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = validWords.map((w) => ({
        word: w.word.trim(),
        translation: w.translation.trim(),
        article: w.article || '',
        plural: w.plural || '',
        language: selectedLanguage,
        exampleSentence: w.exampleSentence || `${w.article ? w.article + ' ' : ''}${w.word} - ${w.translation}`,
        topic: finalTopic,
      }));

      await classService.batchAddVocabulary(token, classId, payload);
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary', classId] });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Kütləvi sözlər əlavə edilərkən xəta baş verdi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kütləvi Söz Və Lüğət Əlavə Et"
      description="Söz siyahısını bura yapışdırın (Copy-Paste) — sistem avtomatik çevirəcək."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Topic / Category Selection Bar */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Lüğət Mövzusu / Qrupu *
              </label>
              {existingTopics.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsNewTopic(!isNewTopic)}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isNewTopic ? 'Mövcud Mövzulardan Seç' : '+ Yeni Mövzu Yarat'}
                </button>
              )}
            </div>

            {isNewTopic || existingTopics.length === 0 ? (
              <Input
                placeholder="Mövzunun adını yazın (Məsələn: Bədən üzvləri, Ailə, Yeməklər...)"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                required
              />
            ) : (
              <Select
                options={existingTopics.map((t) => ({ value: t, label: t }))}
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Tab Selection: Copy-Paste vs Manual Table */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'paste'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-brand-400" />
            📋 Copy-Paste Çevirici
          </button>
          <button
            onClick={() => {
              setActiveMode('table');
              if (parsedRows.length === 0) handleAddEmptyRow();
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'table'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
            ✏️ Cədvəl ({parsedRows.length})
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode 1: Copy-Paste Input */}
        {activeMode === 'paste' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span>💡 Qayda: <strong>der Hund - it</strong> formatında yapışdırın.</span>
              <span className="text-xs text-brand-400 font-mono">Tire (-) və ya (:) ilə ayırın</span>
            </div>

            <textarea
              rows={5}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm p-3 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 resize-y min-h-[120px]"
              placeholder="Sözləri bura kopyalayıb yapışdırın..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <Button
                type="button"
                variant="gradient"
                className="w-full sm:flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold"
                leftIcon={<Sparkles className="w-4 h-4" />}
                isLoading={isSaving}
                onClick={handleParseAndSaveDirectly}
              >
                ⚡ Birbaşa Çevir Və Yadda Saxla
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto py-2.5 sm:py-3 text-xs sm:text-sm shrink-0"
                onClick={() => {
                  handleParseText();
                  setActiveMode('table');
                }}
              >
                Cədvəldə Bax →
              </Button>
            </div>
          </div>
        )}

        {/* Mode 2: Preview & Table Editing */}
        {activeMode === 'table' && (
          <div className="space-y-3">
            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Scrollable table container for mobile */}
            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-[260px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold sticky top-0 border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-2 w-20">Artikl</th>
                    <th className="p-2 w-36">Söz *</th>
                    <th className="p-2 w-36">Tərcüməsi *</th>
                    <th className="p-2">Nümunə Cümlə</th>
                    <th className="p-2 w-10 text-center">Sil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {parsedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40">
                      <td className="p-1.5">
                        <select
                          className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                          value={row.article}
                          onChange={(e) => handleUpdateRow(row.id, 'article', e.target.value)}
                        >
                          <option value="der">der</option>
                          <option value="die">die</option>
                          <option value="das">das</option>
                          <option value="">(yox)</option>
                        </select>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          placeholder="Hund"
                          className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:border-brand-500"
                          value={row.word}
                          onChange={(e) => handleUpdateRow(row.id, 'word', e.target.value)}
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          placeholder="it"
                          className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                          value={row.translation}
                          onChange={(e) => handleUpdateRow(row.id, 'translation', e.target.value)}
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          placeholder="Nümunə"
                          className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:border-brand-500"
                          value={row.exampleSentence}
                          onChange={(e) => handleUpdateRow(row.id, 'exampleSentence', e.target.value)}
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
              <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleAddEmptyRow} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Sətir Əlavə Et
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Ləğv Et
                </Button>
                <Button
                  type="button"
                  variant="gradient"
                  size="sm"
                  isLoading={isSaving}
                  disabled={parsedRows.length === 0}
                  onClick={handleSaveAll}
                >
                  Bütün {parsedRows.filter((r) => r.word.trim()).length} Sözü Yadda Saxla →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
