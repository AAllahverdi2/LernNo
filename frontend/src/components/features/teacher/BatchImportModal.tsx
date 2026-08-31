import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useVocabulary } from '../../../hooks/useVocabulary';
import type { GermanArticle } from '../../../types';
import { Plus, Trash2, FileSpreadsheet, Check } from 'lucide-react';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BatchRow {
  id: string;
  word: string;
  translation: string;
  article: GermanArticle;
  plural: string;
  exampleSentence: string;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({ isOpen, onClose }) => {
  const { batchAddWords, isAdding } = useVocabulary();

  const [rows, setRows] = useState<BatchRow[]>([
    { id: '1', word: 'Haus', translation: 'house / ev', article: 'das', plural: 'die Häuser', exampleSentence: 'Das Haus ist sehr groß.' },
    { id: '2', word: 'Tisch', translation: 'table / masa', article: 'der', plural: 'die Tische', exampleSentence: 'Der Tisch steht im Zimmer.' },
    { id: '3', word: 'Katze', translation: 'cat / pişik', article: 'die', plural: 'die Katzen', exampleSentence: 'Die Katze schläft auf dem Sofa.' },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now().toString(), word: '', translation: '', article: 'der', plural: '', exampleSentence: '' },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: keyof BatchRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r.word.trim() && r.translation.trim());
    if (validRows.length === 0) return;

    await batchAddWords(
      validRows.map((r) => ({
        word: r.word,
        translation: r.translation,
        article: r.article,
        plural: r.plural,
        exampleSentence: r.exampleSentence,
        dayNumber: 4,
        topic: 'Batch Imported Set',
        status: 'Published',
      }))
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Batch Import Vocabulary"
      description="Paste or fill in multiple vocabulary items directly in this table."
      maxWidth="4xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-brand-400" />
            <span>Fast multi-word input mode — Fill rows or click "+ Add Row" to expand.</span>
          </div>
          <Button size="sm" variant="ghost" onClick={addRow} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Row
          </Button>
        </div>

        {/* Interactive Spreadsheet Table */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3 w-28">Article</th>
                <th className="p-3 w-40">German Word *</th>
                <th className="p-3 w-48">Translation (EN/AZ) *</th>
                <th className="p-3 w-36">Plural</th>
                <th className="p-3">Example Sentence</th>
                <th className="p-3 w-12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40">
                  <td className="p-2">
                    <select
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                      value={row.article}
                      onChange={(e) => updateRow(row.id, 'article', e.target.value as any)}
                    >
                      <option value="der">der</option>
                      <option value="die">die</option>
                      <option value="das">das</option>
                      <option value="">(none)</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="e.g. Haus"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                      value={row.word}
                      onChange={(e) => updateRow(row.id, 'word', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="e.g. house"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                      value={row.translation}
                      onChange={(e) => updateRow(row.id, 'translation', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="e.g. die Häuser"
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                      value={row.plural}
                      onChange={(e) => updateRow(row.id, 'plural', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="e.g. Das Haus ist groß."
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500"
                      value={row.exampleSentence}
                      onChange={(e) => updateRow(row.id, 'exampleSentence', e.target.value)}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <Button type="button" variant="outline" size="sm" onClick={addRow} leftIcon={<Plus className="w-4 h-4" />}>
            Add Another Row
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              isLoading={isAdding}
              leftIcon={<Check className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Import {rows.filter((r) => r.word.trim()).length} Words
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
