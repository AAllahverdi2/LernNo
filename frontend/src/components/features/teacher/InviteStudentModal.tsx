import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { SearchableStudentSelect } from './SearchableStudentSelect';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface InviteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onSuccess?: () => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const InviteStudentModal: React.FC<InviteStudentModalProps> = ({
  isOpen,
  onClose,
  classId,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !token) {
      setError('Zəhmət olmasa tələbə seçin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await classService.inviteStudent(token, classId, selectedStudent.id, selectedStudent.email);
      setSuccessMsg(res.message || 'Tələbəyə qrup dəvəti göndərildi!');
      setTimeout(() => {
        setSelectedStudent(null);
        setSuccessMsg(null);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Dəvət göndərilərkən xəta baş verdi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Qrupa Tələbə Dəvət Et">
      <form onSubmit={handleInvite} className="space-y-5 pt-2">
        <p className="text-xs text-slate-400">
          Sistemdə qeydiyyatdan keçmiş tələbəni axtarıb seçin. Dəvət göndərildikdə tələbə öz panelində bildirişi təsdiqlədikdən sonra qrupa qoşulacaq.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <SearchableStudentSelect
          selectedStudent={selectedStudent}
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            setError(null);
          }}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose}>
            Ləğv Et
          </Button>
          <Button
            variant="gradient"
            type="submit"
            isLoading={isLoading}
            disabled={!selectedStudent}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Dəvət Göndər
          </Button>
        </div>
      </form>
    </Modal>
  );
};
