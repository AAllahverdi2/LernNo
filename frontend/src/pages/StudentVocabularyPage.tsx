import React from 'react';
import { useClasses } from '../hooks/useClasses';
import { VocabularyManager } from '../components/features/teacher/VocabularyManager';
import { useSearchParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const StudentVocabularyPage: React.FC = () => {
  const { classes, isLoading } = useClasses();
  const [searchParams, setSearchParams] = useSearchParams();
  const classIdParam = searchParams.get('classId');

  const selectedClass = classes.find((c) => c.id === classIdParam) || classes[0];

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
        Qruplar və lüğətlər yüklənir...
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
        <GraduationCap className="w-12 h-12 mx-auto mb-3 text-brand-400 opacity-60" />
        <h3 className="text-lg font-bold text-white mb-1">Hələ Heç Bir Qrupa Əlavə Edilməmisiniz</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Müəlliminiz sizi qrupa əlavə etdikdən və lüğət təyin etdikdən sonra bütün sözlər burada görünəcək.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* If student is in multiple classes, show a tab/selector */}
      {classes.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit overflow-x-auto">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSearchParams({ classId: cls.id })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedClass?.id === cls.id
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cls.name} ({cls.language})
            </button>
          ))}
        </div>
      )}

      {/* Vocabulary Manager dynamically loaded for this student's class */}
      <VocabularyManager classId={selectedClass?.id} />
    </div>
  );
};
