import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Button } from '../../common/Button';
import { useClasses } from '../../../hooks/useClasses';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose }) => {
  const { createClass, isCreating } = useClasses();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('German');
  const [level, setLevel] = useState<any>('A2');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createClass({
      name,
      language,
      level,
      description,
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Class"
      description="Set up a new workspace for your students to learn vocabulary."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Class Name"
          placeholder="e.g. German A2 — Everyday Conversation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Language"
            options={[
              { value: 'German', label: 'German' },
              { value: 'Spanish', label: 'Spanish' },
              { value: 'French', label: 'French' },
              { value: 'Italian', label: 'Italian' },
            ]}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <Select
            label="CEFR Level"
            options={[
              { value: 'A1', label: 'A1 — Beginner' },
              { value: 'A2', label: 'A2 — Elementary' },
              { value: 'B1', label: 'B1 — Intermediate' },
              { value: 'B2', label: 'B2 — Upper Int' },
              { value: 'C1', label: 'C1 — Advanced' },
              { value: 'C2', label: 'C2 — Mastery' },
            ]}
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Class Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            placeholder="Describe the goals and topic focus of this class..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" isLoading={isCreating}>
            Create Class
          </Button>
        </div>
      </form>
    </Modal>
  );
};
