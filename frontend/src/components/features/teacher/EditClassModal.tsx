import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Button } from '../../common/Button';
import { Save, AlertCircle } from 'lucide-react';

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classDetail: {
    id: string;
    name: string;
    language: string;
    level: string;
    schedule?: string;
    description?: string;
  };
  onSuccess?: () => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  onClose,
  classDetail,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [name, setName] = useState(classDetail.name);
  const [language, setLanguage] = useState(classDetail.language || 'Alman Dili');
  const [level, setLevel] = useState(classDetail.level || 'A2');
  const [schedule, setSchedule] = useState(classDetail.schedule || '1-3-5 Saat 14:00');
  const [description, setDescription] = useState(classDetail.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(classDetail.name);
    setLanguage(classDetail.language || 'Alman Dili');
    setLevel(classDetail.level || 'A2');
    setSchedule(classDetail.schedule || '1-3-5 Saat 14:00');
    setDescription(classDetail.description || '');
  }, [classDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      await classService.updateClass(token, classDetail.id, {
        name,
        language,
        level,
        schedule,
        description,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Qrup yenilənərkən xəta baş verdi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ Qrup Məlumatlarına Düzəliş Et"
      description="Qrupun adını, fənnini, səviyyəsini və dərs cədvəlini yeniləyin."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Qrupun Adı *"
          placeholder="Məsələn: 1-3-5 Saat 14:00 Qrupu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <Select
            label="Səviyyə (Level) *"
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
          label="Dərs Günləri Və Saatı"
          placeholder="Məsələn: 1-3-5 Saat 14:00"
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
            placeholder="Qrupun məqsədini daxil edin..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Ləğv et
          </Button>
          <Button type="submit" variant="gradient" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
            Yadda Saxla →
          </Button>
        </div>
      </form>
    </Modal>
  );
};
