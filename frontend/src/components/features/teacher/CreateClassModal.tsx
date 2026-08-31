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
  const [language, setLanguage] = useState('Alman Dili');
  const [level, setLevel] = useState('A2');
  const [schedule, setSchedule] = useState('1-3-5 Saat 14:00');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setErrorMessage('');

    try {
      await createClass({
        name,
        language,
        level,
        schedule,
        description,
      });

      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Qrup yaradıla bilmədi.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Qrup Və Ya Sınaq Qrupu Yarat"
      description="Tələbələriniz üçün yeni dərs və ya sınaq qrupu yaradın."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <Input
          label="Qrupun Adı"
          placeholder="Məsələn: 1-3-5 Saat 14:00 Qrupu və ya A2 Sınaq Qrupu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Fənn / Dil"
            options={[
              { value: 'Alman Dili', label: 'Alman Dili' },
              { value: 'İngilis Dili', label: 'İngilis Dili' },
              { value: 'Fransız Dili', label: 'Fransız Dili' },
              { value: 'İspan Dili', label: 'İspan Dili' },
              { value: 'Riyaziyyat', label: 'Riyaziyyat' },
              { value: 'Tarix', label: 'Tarix' },
              { value: 'Fizika', label: 'Fizika' },
              { value: 'Azərbaycan Dili', label: 'Azərbaycan Dili' },
            ]}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <Select
            label="Səviyyə (Level)"
            options={[
              { value: 'A1', label: 'A1 — Başlanğıc' },
              { value: 'A2', label: 'A2 — Orta İbtidai' },
              { value: 'B1', label: 'B1 — Orta' },
              { value: 'B2', label: 'B2 — Yüksək Orta' },
              { value: 'C1', label: 'C1 — İrəli Səviyyə' },
              { value: 'Ümumi Sınaq', label: 'Ümumi Sınaq Qrupu' },
            ]}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>

        <Input
          label="Dərs Günləri Və Saatı (Cədvəl)"
          placeholder="Məsələn: 1-3-5 Saat 14:00 və ya 2-4-6 Saat 16:00"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Qrup Haqqında Məlumat
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            placeholder="Qrupun məqsədini və tələbələr üçün qeydləri daxil edin..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
          <Button type="submit" variant="gradient" isLoading={isCreating}>
            Qrupu Yarat →
          </Button>
        </div>
      </form>
    </Modal>
  );
};
