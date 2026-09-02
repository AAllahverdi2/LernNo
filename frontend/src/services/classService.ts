const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export interface CreateClassPayload {
  name: string;
  language: string;
  targetLanguage?: string;
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
  // Search students for autocomplete dropdown
  async searchStudents(token: string, search: string = '') {
    const response = await fetch(`${API_BASE_URL}/classes/students/search?search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Tələbələr yüklənə bilmədi.');
    return result.students || [];
  },

  // Invite student to class by studentId or email
  async inviteStudent(token: string, classId: string, studentId: string, email?: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, email }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Tələbəyə dəvət göndərilə bilmədi.');
    return result;
  },

  // Get invitations for logged-in student
  async getMyInvitations(token: string) {
    const response = await fetch(`${API_BASE_URL}/classes/invitations/my-invitations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Dəvətlər yüklənə bilmədi.');
    return result.invitations || [];
  },

  // Respond to invitation (ACCEPT or REJECT)
  async respondToInvitation(token: string, enrollmentId: string, action: 'ACCEPT' | 'REJECT') {
    const response = await fetch(`${API_BASE_URL}/classes/invitations/${enrollmentId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Cavab göndərilə bilmədi.');
    return result;
  },

  // Update Class details
  async updateClass(token: string, classId: string, payload: Partial<CreateClassPayload>) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qrupa düzəliş edilə bilmədi.');
    return result;
  },

  // Delete Class
  async deleteClass(token: string, classId: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qrup silinə bilmədi.');
    return result;
  },

  // Remove student from class
  async removeStudent(token: string, classId: string, studentId: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Tələbə qrupdan çıxarıla bilmədi.');
    return result;
  },

  // Add single vocabulary word
  async addVocabulary(token: string, classId: string, payload: any) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Söz əlavə edilə bilmədi.');
    return result;
  },

  // Get all vocabulary & categories from database for a class (or master)
  async getVocabulary(token: string, classId: string, params?: { topic?: string; page?: number; limit?: number; search?: string; language?: string; master?: boolean }) {
    const query = new URLSearchParams();
    if (params?.topic) query.append('topic', params.topic);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.language) query.append('language', params.language);
    if (params?.master) query.append('master', 'true');

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lüğət yüklənə bilmədi.');
    return result; // { words, categories, categoriesData, languages, languagesData, total, totalPages }
  },

  // Batch add vocabulary words (Copy-Paste Bulk Parser)
  async batchAddVocabulary(token: string, classId: string, words: any[]) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ words }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Kütləvi sözlər əlavə edilə bilmədi.');
    return result;
  },

  // Delete vocabulary word
  async deleteVocabulary(token: string, wordId: string) {
    const response = await fetch(`${API_BASE_URL}/classes/vocabulary/${wordId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Söz silinə bilmədi.');
    return result;
  },

  // Delete or unassign entire vocabulary topic/dictionary
  async deleteVocabularyTopic(token: string, classId: string, topic: string, language?: string, unassignOnly?: boolean) {
    const query = new URLSearchParams();
    query.append('topic', topic);
    if (language) query.append('language', language);
    if (unassignOnly) query.append('unassignOnly', 'true');

    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary/topic?${query.toString()}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lüğət silinə bilmədi.');
    return result;
  },

  // Assign specific topics / dictionaries to a class
  async assignTopics(token: string, classId: string, topics: string[]) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topics }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Lüğətlər qrupa təyin edilə bilmədi.');
    return result;
  },

  // Get assigned topics for a class
  async getClassAssignments(token: string, classId: string) {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Qrup lüğət təyinatları yüklənə bilmədi.');
    return result; // { assignedTopics: string[] }
  },
};
