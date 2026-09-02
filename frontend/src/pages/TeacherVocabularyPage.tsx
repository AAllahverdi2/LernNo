import React from 'react';
import { VocabularyManager } from '../components/features/teacher/VocabularyManager';
import { useClasses } from '../hooks/useClasses';

export const TeacherVocabularyPage: React.FC = () => {
  const { classes, isLoading } = useClasses();
  const activeClassId = classes[0]?.id;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
        Lüğət bazası yüklənir...
      </div>
    );
  }

  return <VocabularyManager classId={activeClassId} isMaster={true} />;
};
