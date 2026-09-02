import type { VocabularyWord, VocabularySet } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const getAuthToken = () => {
  return (
    localStorage.getItem('lernno_jwt_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('lernno_token')
  );
};

export const vocabularyService = {
  async getVocabularyWords(classId?: string): Promise<VocabularyWord[]> {
    const token = getAuthToken();
    if (token && classId) {
      const response = await fetch(`${API_BASE_URL}/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.class && Array.isArray(result.class.vocabularyWords)) {
        return result.class.vocabularyWords;
      }
    }
    return [];
  },

  async getVocabularySets(_classId?: string): Promise<VocabularySet[]> {
    return [];
  },

  async addVocabularyWord(word: Partial<VocabularyWord>): Promise<VocabularyWord> {
    const token = getAuthToken();
    if (!token) throw new Error('Sistemə daxil olunmayıb (Token tapılmadı).');
    if (!word.classId) throw new Error('Qrup ID daxil edilməyib.');

    const response = await fetch(`${API_BASE_URL}/classes/${word.classId}/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(word),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Söz əlavə edilə bilmədi.');
    return result.word;
  },

  async batchAddVocabularyWords(words: Partial<VocabularyWord>[]): Promise<any> {
    const token = getAuthToken();
    const classId = words[0]?.classId || 'class-de-a2';

    if (!token) throw new Error('Sistemə daxil olunmayıb (Token tapılmadı).');

    const response = await fetch(`${API_BASE_URL}/classes/${classId}/vocabulary/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ words }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Kütləvi sözlər daxil edilə bilmədi.');
    return result;
  },

  async deleteVocabularyWord(id: string): Promise<boolean> {
    const token = getAuthToken();
    if (!token) throw new Error('Sistemə daxil olunmayıb (Token tapılmadı).');

    const response = await fetch(`${API_BASE_URL}/classes/vocabulary/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Söz silinə bilmədi.');
    return true;
  },
};
