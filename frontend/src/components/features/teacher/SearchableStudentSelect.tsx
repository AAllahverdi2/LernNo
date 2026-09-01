import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { Search, UserCheck, X, Loader2 } from 'lucide-react';
import { Avatar } from '../../common/Avatar';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subject?: string;
}

interface SearchableStudentSelectProps {
  onSelectStudent: (student: Student | null) => void;
  selectedStudent: Student | null;
}

export const SearchableStudentSelect: React.FC<SearchableStudentSelectProps> = ({
  onSelectStudent,
  selectedStudent,
}) => {
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const list = await classService.searchStudents(token, search);
        setStudents(list);
      } catch (err) {
        console.error('Failed to search students:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [search, token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (student: Student) => {
    onSelectStudent(student);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectStudent(null);
    setSearch('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
        Tələbə Seçin (Axtarışlı Siyahı)
      </label>

      {selectedStudent ? (
        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={selectedStudent.avatar} name={selectedStudent.name} size="sm" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{selectedStudent.name}</p>
              <p className="text-[11px] text-slate-400">{selectedStudent.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Tələbənin adı və ya e-poçt ünvanı ilə axtarın..."
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
          {isLoading && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 animate-spin" />
          )}
        </div>
      )}

      {isOpen && !selectedStudent && (
        <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-xl py-2 z-50 divide-y divide-slate-800/60 animate-in fade-in slide-in-from-top-2">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              Tələbələr axtarılır...
            </div>
          ) : students.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Qeydiyyatdan keçmiş tələbə tapılmadı.
            </div>
          ) : (
            students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => handleSelect(student)}
                className="w-full p-3 flex items-center justify-between hover:bg-slate-800/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={student.avatar} name={student.name} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{student.name}</p>
                    <p className="text-[11px] text-slate-400">{student.email}</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-slate-500 hover:text-brand-400" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
