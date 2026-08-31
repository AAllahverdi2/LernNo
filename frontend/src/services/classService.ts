const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lern-no.vercel.app/api';

export interface CreateClassPayload {
  name: string;
  language: string;
  level: string;
  schedule?: string;
  description?: string;
}

export interface AddStudentPayload {
  email: string;
}

export interface AddVocabularyPayload {
  word: string;
  translation: string;
  article?: string;
  plural?: string;
  exampleSentence: string;
  topic?: string;
  difficulty?: string;
}

export interface CreateQuizPayload {
  title: string;
  totalQuestions?: number;
  passingScore?: number;
}

export const classService = {
  // Create a new class / group
  async createClass(token: string, data: CreateClassPayload) {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qrup yaradıla bilmədi.');
    return result.class;
  },

  // Get all teacher classes
  async getTeacherClasses(token: string) {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qruplar yüklənə bilmədi.');
    return result.classes;
  },

  // Get detailed info for a single class
  async getClassDetail(token: string, classId: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qrup detalları yüklənə bilmədi.');
    return result.class;
  },

  // Add a student to a class by email
  async addStudentToClass(token: string, classId: string, email: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Tələbə əlavə edilə bilmədi.');
    return result.enrollment;
  },

  // Add vocabulary / assignment to class
  async addVocabularyToClass(token: string, classId: string, data: AddVocabularyPayload) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Söz/Tapşırıq əlavə edilə bilmədi.');
    return result.word;
  },

  // Create Quiz in Class
  async createQuizInClass(token: string, classId: string, data: CreateQuizPayload) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Sınaq yaradıla bilmədi.');
    return result.quiz;
  },
};
