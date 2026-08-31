import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '../../../hooks/useClasses';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LevelBadge, Badge } from '../../common/Badge';
import { Progress } from '../../common/Progress';
import { Input } from '../../common/Input';
import { CreateClassModal } from './CreateClassModal';
import {
  Plus,
  Search,
  Users,
  BookOpen,
  Clock,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  GraduationCap,
} from 'lucide-react';

export const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useClasses();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.level.toLowerCase().includes(search.toLowerCase()) ||
      c.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-brand-400" />
            My Classes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your language groups, daily vocabulary sets, and enrolled students.
          </p>
        </div>

        <Button
          variant="gradient"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Class
        </Button>
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Filter classes by name or level..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} hoverEffect className="p-6 flex flex-col justify-between border-slate-800/80">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <LevelBadge level={cls.level} />
                  <Badge variant="brand">{cls.language}</Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{cls.name}</h3>
                <p className="text-xs text-slate-400 mb-5 line-clamp-2">{cls.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400">Students</span>
                      <strong className="text-white">{cls.studentCount} enrolled</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400">Vocabulary</span>
                      <strong className="text-white">{cls.vocabularyCount} words</strong>
                    </div>
                  </div>
                </div>

                <Progress value={cls.averageProgress} label="Class Average Progress" showValue size="sm" />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {cls.lastActivity}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                >
                  View Class
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden divide-y divide-slate-800/80">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <LevelBadge level={cls.level} />
                <div>
                  <h3 className="text-base font-bold text-white">{cls.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                    <span>{cls.language}</span>
                    <span>•</span>
                    <span>{cls.studentCount} students</span>
                    <span>•</span>
                    <span>{cls.vocabularyCount} words</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-36 hidden sm:block">
                  <Progress value={cls.averageProgress} showValue size="sm" />
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                >
                  View Class
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
