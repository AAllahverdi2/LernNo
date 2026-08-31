import type { VocabularyWord, VocabularySet } from '../types';
import { mockVocabularyWords, mockVocabularySets } from '../data/mockVocabulary';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let localWords = [...mockVocabularyWords];
let localSets = [...mockVocabularySets];

export const vocabularyService = {
  async getVocabularyWords(classId?: string): Promise<VocabularyWord[]> {
    await delay();
    if (classId) {
      return localWords.filter((w) => w.classId === classId || w.classId === 'class-de-a2');
    }
    return [...localWords];
  },

  async getVocabularySets(classId?: string): Promise<VocabularySet[]> {
    await delay();
    if (classId) {
      return localSets.filter((s) => s.classId === classId || s.classId === 'class-de-a2');
    }
    return [...localSets];
  },

  async addVocabularyWord(word: Partial<VocabularyWord>): Promise<VocabularyWord> {
    await delay(200);
    const newWord: VocabularyWord = {
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      classId: word.classId || 'class-de-a2',
      dayNumber: word.dayNumber || 4,
      topic: word.topic || 'General Vocabulary',
      word: word.word || '',
      translation: word.translation || '',
      article: word.article || '',
      plural: word.plural || '',
      exampleSentence: word.exampleSentence || '',
      exampleTranslation: word.exampleTranslation || '',
      difficulty: word.difficulty || 'Medium',
      status: word.status || 'Published',
      phonetic: word.phonetic || '',
      masteredByStudentCount: 0,
    };
    localWords = [newWord, ...localWords];
    return newWord;
  },

  async batchAddVocabularyWords(words: Partial<VocabularyWord>[]): Promise<VocabularyWord[]> {
    await delay(300);
    const createdList: VocabularyWord[] = words.map((w, index) => ({
      id: `w-${Date.now()}-${index}`,
      classId: w.classId || 'class-de-a2',
      dayNumber: w.dayNumber || 4,
      topic: w.topic || 'Batch Imported Vocabulary',
      word: w.word || '',
      translation: w.translation || '',
      article: w.article || '',
      plural: w.plural || '',
      exampleSentence: w.exampleSentence || '',
      exampleTranslation: w.exampleTranslation || '',
      difficulty: w.difficulty || 'Medium',
      status: w.status || 'Published',
      masteredByStudentCount: 0,
    }));

    localWords = [...createdList, ...localWords];
    return createdList;
  },

  async deleteVocabularyWord(id: string): Promise<boolean> {
    await delay(150);
    localWords = localWords.filter((w) => w.id !== id);
    return true;
  },
};
