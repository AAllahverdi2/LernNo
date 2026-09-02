import React, { useState } from 'react';
import { useVocabulary } from '../../../hooks/useVocabulary';
import { useTranslation } from '../../../context/LanguageContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { ArticleBadge } from '../../common/Badge';
import { Input } from '../../common/Input';
import { AddVocabularyModal } from './AddVocabularyModal';
import { BatchImportModal } from './BatchImportModal';
import { CreateLanguagePairModal } from './CreateLanguagePairModal';
import { AssignVocabularyModal } from './AssignVocabularyModal';
import { Toast } from '../../common/Toast';
import { ConfirmModal } from '../../common/ConfirmModal';
import { Pagination } from '../../common/Pagination';
import { useAuth } from '../../../context/AuthContext';
import {
  Plus,
  Volume2,
  Trash2,
  Search,
  BookOpen,
  FileSpreadsheet,
  FolderOpen,
  Globe,
  ArrowRight,
  ArrowLeft,
  Layers,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface VocabularyManagerProps {
  classId?: string;
  isMaster?: boolean;
}

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({ classId, isMaster }) => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const isStudent = role === 'student';

  // Navigation State: null = Topics Overview; string = Topic Dictionary List View
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Filter & Pagination State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // 50 dictionary words per page for fast reading
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Call API with topic, language & pagination filters only when viewing topic!
  const {
    words,
    categories,
    categoriesData,
    languages,
    languagesData,
    total,
    totalPages,
    isLoading,
    deleteWord,
    deleteTopic,
  } = useVocabulary(classId, {
    topic: selectedTopic || undefined,
    language: selectedLanguage || undefined,
    page: currentPage,
    limit: itemsPerPage,
    search: search.trim() || undefined,
    master: isMaster,
  });

  // Modals & Toast State
  const [isCreateLangPairOpen, setIsCreateLangPairOpen] = useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [targetTopicForBatch, setTargetTopicForBatch] = useState<string>('');
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message?: string } | null>(null);

  // Web Speech API text-to-speech
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const confirmDeleteWord = async () => {
    if (!wordToDelete) return;
    const targetId = wordToDelete;
    // Close modal & display toast instantly (0ms delay for user UX!)
    setWordToDelete(null);
    setToast({ type: 'success', title: 'Söz Silindi', message: 'Söz lüğətdən uğurla silindi.' });
    try {
      await deleteWord(targetId);
    } catch (err: any) {
      setToast({ type: 'error', title: 'Xəta', message: err.message || 'Söz silinərkən xəta baş verdi.' });
    }
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    const targetName = topicToDelete;
    setTopicToDelete(null);
    if (selectedTopic === targetName) {
      setSelectedTopic(null);
    }
    const isUnassign = !!classId;
    setToast({
      type: 'success',
      title: isUnassign ? 'Lüğət Qrupdan Çıxarıldı' : 'Lüğət Bazadan Silindi',
      message: isUnassign
        ? `'${targetName}' lüğəti bu qrupdan çıxarıldı (Ümumi bazanızda saxlanıldı).`
        : `'${targetName}' lüğəti və bütün sözləri bazadan silindi.`,
    });
    try {
      await deleteTopic({ topic: targetName, language: selectedLanguage || undefined, unassignOnly: isUnassign });
    } catch (err: any) {
      setToast({ type: 'error', title: 'Xəta', message: err.message || 'Lüğət silinərkən xəta baş verdi.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SECTION 1: TOPIC CARDS OVERVIEW (When no specific topic is selected) */}
      {!selectedTopic && (
        <div className="space-y-6">
          {/* Main Language Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-brand-950 border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                <Globe className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    Aktiv Dil Cütlüyü
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedLanguage ? `${selectedLanguage} ➔ Azərbaycan Dili` : 'Bütün Dil Cütlükləri (Alman, İngilis, Rus, Çex...)'}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">Lüğət Və Mövzuların İdarə Olunması</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Mövzunu seçərək minlərlə sözü yüngül lüğət siyahısı (list) formatında sürətlə vərəqləyin.
                </p>
              </div>
            </div>

            {!isStudent && (
              <div className="shrink-0">
                <Button
                  variant="gradient"
                  size="md"
                  className="px-5 py-3 text-xs sm:text-sm font-extrabold shadow-xl"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsCreateLangPairOpen(true)}
                >
                  ✨ + Yeni Lüğət Yarat
                </Button>
              </div>
            )}
          </div>

          {/* Section Title & Clean Language Filter Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Mövzu Qrupları ({categories.length} mövzu)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hər hansı bir lüğətin "Sözlərə Bax" düyməsinə klikləyərək lüğət siyahısını aça bilərsiniz.
              </p>
            </div>

            {/* Clean Language Filter Selector Dropdown */}
            <div className="w-full sm:w-64 shrink-0">
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setSelectedTopic(null);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-bold text-white focus:outline-none focus:border-brand-500 shadow-md cursor-pointer transition-all hover:border-slate-600"
              >
                <option value="" className="bg-slate-900 text-slate-300 font-bold">
                  🌐 Bütün Dil Cütlükləri ({languages.length} dil)
                </option>
                {languagesData.map((lang) => (
                  <option key={lang.name} value={lang.name} className="bg-slate-900 text-white font-bold">
                    {lang.name} ({lang.count} söz)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Cards Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
              Lüğət bazası serverdən yüklənir...
            </div>
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center border-slate-800 space-y-4 bg-slate-900/40">
              <FolderOpen className="w-12 h-12 text-brand-400 mx-auto opacity-80" />
              <div>
                <h3 className="text-base font-bold text-slate-200">
                  {isStudent
                    ? 'Bu Qrupa Hələ Lüğət Paylaşılmayıb'
                    : classId
                    ? 'Bu Qrupa Hələ Lüğət Təyin Edilməyib'
                    : 'Bu Dil Cütlüyündə Hələ Mövzu Yoxdur'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {isStudent
                    ? 'Müəlliminiz bu qrup üçün lüğət təyin etdikdən sonra bütün mövzular və sözlər burada görünəcək.'
                    : classId
                    ? 'Qrupunuz üçün müəllim lüğət bazanızdan istədiyiniz lüğətləri seçib bu qrupa bərkidə bilərsiniz.'
                    : 'Bütün mövzular və sözlər birbaşa verilənlər bazasından gəlir. Lüğət yaradaraq ilk sözlərinizi daxil edin.'}
                </p>
              </div>
              {!isStudent && (
                classId ? (
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => setIsAssignModalOpen(true)}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    ✨ + Qrupa Lüğət Qoş
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => {
                      setTargetTopicForBatch('');
                      setIsBatchOpen(true);
                    }}
                    leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                  >
                    📋 İlk Mövzunu Və Sözləri Daxil Et
                  </Button>
                )
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriesData.map((cat) => (
                <Card
                  key={cat.name}
                  className="p-5 border-slate-800 hover:border-brand-500/50 bg-slate-900/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-105 transition-transform">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-extrabold border border-brand-500/30">
                        {cat.count} söz
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {selectedLanguage || 'Alman'} ➔ Azərbaycan Lüğəti
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full justify-between"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedTopic(cat.name);
                        setCurrentPage(1);
                        setSearch('');
                      }}
                    >
                      Sözlərə Bax ({cat.count})
                    </Button>
                    {!isStudent && (
                      <>
                        <button
                          onClick={() => {
                            setTargetTopicForBatch(cat.name);
                            setIsBatchOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-brand-300 hover:bg-slate-800 border border-slate-800 transition-colors shrink-0"
                          title="Bu qrupa Copy-Paste 100-1000 söz əlavə et"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTopicToDelete(cat.name)}
                          className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors shrink-0"
                          title="Bu lüğəti və bütün sözlərini bazadan tamamilə sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: DICTIONARY LIST VIEW (When a topic is selected) */}
      {selectedTopic && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setCurrentPage(1);
                  setSearch('');
                }}
                className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                title="Bütün Mövzulara Qayıt"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    Lüğət Siyahısı
                  </span>
                  <span className="text-xs text-slate-400">• {total} ümumi söz</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 mt-0.5">
                  <FolderOpen className="w-5 h-5 text-brand-400" />
                  {selectedTopic}
                </h1>
              </div>
            </div>

            {!isStudent && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="gradient"
                  size="sm"
                  leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                  onClick={() => {
                    setTargetTopicForBatch(selectedTopic);
                    setIsBatchOpen(true);
                  }}
                >
                  📋 Kütləvi Copy-Paste
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsAddWordOpen(true)}
                >
                  + Söz
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setTopicToDelete(selectedTopic)}
                >
                  Lüğəti Sil
                </Button>
              </div>
            )}
          </div>

          {/* Search, Language Filter & Pagination Limit Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
              <div className="w-full sm:w-72">
                <Input
                  placeholder="Lüğətdə söz və ya tərcümə axtarın..."
                  leftIcon={<Search className="w-4 h-4" />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Language Filter Dropdown */}
              <div className="w-full sm:w-48 shrink-0">
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold text-xs focus:outline-none focus:border-brand-500 transition-colors"
                >
                  <option value="">🌐 Bütün Dillər</option>
                  <option value="Alman Dili">🇩🇪 Alman Dili</option>
                  <option value="İngilis Dili">🇬🇧 İngilis Dili</option>
                  <option value="Rus Dili">🇷🇺 Rus Dili</option>
                  <option value="Çex Dili">🇨🇿 Çex Dili</option>
                  <option value="Fransız Dili">🇫🇷 Fransız Dili</option>
                  <option value="İspan Dili">🇪🇸 İspan Dili</option>
                  <option value="İtalyan Dili">🇮🇹 İtalyan Dili</option>
                  <option value="Türk Dili">🇹🇷 Türk Dili</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 w-full md:w-auto justify-end shrink-0">
              <span>Səhifə başına:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold text-xs focus:outline-none focus:border-brand-500"
              >
                <option value={25}>25 söz</option>
                <option value={50}>50 söz</option>
                <option value={100}>100 söz</option>
              </select>
            </div>
          </div>

          {/* DICTIONARY LIST CONTAINER */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
              Sözlər lüğəti yüklənir...
            </div>
          ) : words.length === 0 ? (
            <Card className="p-10 text-center border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Söz Tapılmadı</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bu mövzuda hələ söz yoxdur və ya axtarışa uyğun nəticə tapılmadı.
              </p>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => {
                  setTargetTopicForBatch(selectedTopic);
                  setIsBatchOpen(true);
                }}
                leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              >
                📋 Kütləvi Söz Əlavə Et
              </Button>
            </Card>
          ) : (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 divide-y divide-slate-800/40 overflow-hidden shadow-xl">
              {words.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-transparent transition-colors group"
                >
                  {/* Left: German Article + Word + Audio */}
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    <span className="text-xs text-slate-500 font-mono w-6 shrink-0 text-right">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </span>

                    <ArticleBadge article={item.article} />

                    <span className="font-extrabold text-white text-sm sm:text-base tracking-wide truncate group-hover:text-brand-400 transition-colors">
                      {item.word}
                    </span>

                    <button
                      type="button"
                      onClick={() => playAudio(`${item.article || ''} ${item.word}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors shrink-0"
                      title="Səsli tələffüz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Center Leader (Visual dictionary connector on wide screens) */}
                  <div className="hidden md:flex flex-1 items-center px-4">
                    <div className="w-full border-b border-dashed border-slate-700/30" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Right: Azerbaijani Translation + Delete */}
                  <div className="flex items-center gap-4 shrink-0 pl-2">
                    <span className="font-bold text-slate-200 text-sm sm:text-base text-right group-hover:text-brand-400 transition-colors">
                      {item.translation}
                    </span>

                    {!isStudent && (
                      <button
                        type="button"
                        onClick={() => setWordToDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all"
                        title="Sözü sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIGHTWEIGHT PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={total}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Create New Language Pair Modal */}
      {isCreateLangPairOpen && (
        <CreateLanguagePairModal
          isOpen={isCreateLangPairOpen}
          onClose={() => setIsCreateLangPairOpen(false)}
          classId={classId}
        />
      )}

      {/* Add Single Word Modal */}
      {isAddWordOpen && (
        <AddVocabularyModal
          isOpen={isAddWordOpen}
          onClose={() => setIsAddWordOpen(false)}
          defaultTopic={selectedTopic || targetTopicForBatch || undefined}
          defaultLanguage={selectedLanguage || undefined}
        />
      )}

      {/* Batch Import Copy-Paste Modal */}
      {isBatchOpen && (
        <BatchImportModal
          isOpen={isBatchOpen}
          onClose={() => setIsBatchOpen(false)}
          classId={classId}
          existingTopics={categories}
          defaultTopic={selectedTopic || targetTopicForBatch || undefined}
        />
      )}

      {/* Assign Dictionaries to Group Modal */}
      {isAssignModalOpen && classId && (
        <AssignVocabularyModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          classId={classId}
          classNameTitle="Qrup"
          allTopics={categoriesData}
        />
      )}

      {/* Confirm Delete Word Modal */}
      <ConfirmModal
        isOpen={!!wordToDelete}
        onClose={() => setWordToDelete(null)}
        onConfirm={confirmDeleteWord}
        title="Sözü Lüğətdən Sil"
        description="Bu sözü lüğət bazasından silməyə əminsiniz?"
        confirmText="Sil"
      />

      {/* Confirm Delete / Unassign Topic Modal */}
      <ConfirmModal
        isOpen={!!topicToDelete}
        onClose={() => setTopicToDelete(null)}
        onConfirm={confirmDeleteTopic}
        title={classId ? "Lüğəti Qrupdan Çıxar" : "Lüğəti Və Bütün Sözlərini Sil"}
        description={
          classId
            ? `'${topicToDelete}' lüğətini bu qrupdan çıxarmağa əminsiniz? (Lüğət ümumi lüğət bazanızda saxlanılacaq, sadəcə bu qrupun tələbələrinə görünməyəcək)`
            : `'${topicToDelete}' lüğətini və onun daxilindəki bütün sözləri verilənlər bazasından həmişəlik silməyə əminsiniz?`
        }
        confirmText={classId ? "Qrupdan Çıxar" : "Lüğəti Sil"}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
