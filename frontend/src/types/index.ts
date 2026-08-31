export type UserRole = 'teacher' | 'student' | 'admin' | 'TEACHER' | 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin' | 'TEACHER' | 'STUDENT' | 'ADMIN';
  avatar?: string;
  title?: string;
  language?: string;
  streak?: number;
  xp?: number;
  createdAt?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type GermanArticle = 'der' | 'die' | 'das' | '';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type WordStatus = 'Published' | 'Draft' | 'Review';

export interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  wordsLearned: number;
  quizAverage: number;
  streak: number;
  lastActive: string;
  status: 'Excellent' | 'On Track' | 'Needs Review';
}

export interface ClassItem {
  id: string;
  name: string;
  language: string;
  level: CEFRLevel;
  teacherId: string;
  studentCount: number;
  vocabularyCount: number;
  averageProgress: number; // 0 to 100
  lastActivity: string;
  description: string;
  students: StudentRosterItem[];
  color: string;
}

export interface VocabularyWord {
  id: string;
  classId: string;
  setId?: string;
  dayNumber: number;
  topic: string;
  word: string;
  translation: string;
  article?: GermanArticle;
  plural?: string;
  exampleSentence: string;
  exampleTranslation?: string;
  difficulty: DifficultyLevel;
  status: WordStatus;
  masteredByStudentCount?: number;
  phonetic?: string;
  audioUrl?: string;
}

export interface VocabularySet {
  id: string;
  classId: string;
  dayNumber: number;
  topic: string;
  wordsCount: number;
  status: 'Published' | 'Draft';
  createdAt: string;
  words: VocabularyWord[];
}

export interface LessonSummary {
  classId: string;
  className: string;
  dayNumber: number;
  topic: string;
  newWordsCount: number;
  reviewWordsCount: number;
  quizQuestionsCount: number;
  completedStudentsCount: number;
  totalStudentsCount: number;
  isPublished: boolean;
}

export type QuestionType = 'mcq' | 'article' | 'translation';

export interface QuizQuestion {
  id: string;
  wordId: string;
  type: QuestionType;
  prompt: string;
  articleTarget?: GermanArticle;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  classId: string;
  dayNumber: number;
  title: string;
  questions: QuizQuestion[];
  timeLimitSeconds?: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctWordIds: string[];
  incorrectWordIds: string[];
  completedAt: string;
}

export interface StudentProgress {
  wordsLearned: number;
  wordsMastered: number;
  wordsToReview: number;
  currentStreak: number;
  dailyGoal: number;
  dailyLearned: number;
  weeklyActivity: { day: string; wordsCount: number; minutes: number }[];
  masteryBreakdown: { level: string; count: number }[];
  recentQuizScores: { id: string; title: string; score: number; date: string }[];
  wordsNeedingReview: VocabularyWord[];
}

export interface TeacherAnalytics {
  completionRate: number;
  vocabularyMastery: number;
  quizPerformanceAverage: number;
  studentsNeedingHelpCount: number;
  dailyActiveStudents: { day: string; activeCount: number }[];
  hardestWords: { word: string; article?: string; translation: string; failureRate: number; topic: string }[];
  studentRoster: StudentRosterItem[];
}

export interface AIGenerationRequest {
  topic: string;
  language: string;
  level: CEFRLevel;
  wordCount: number;
  difficulty: DifficultyLevel;
  customPrompt?: string;
}
