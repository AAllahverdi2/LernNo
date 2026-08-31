import type { AIGenerationRequest, VocabularyWord } from '../types';

const delay = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAIPool: Record<string, Partial<VocabularyWord>[]> = {
  Travel: [
    { word: 'Fahrplan', article: 'der', plural: 'die Fahrpläne', translation: 'timetable, schedule', exampleSentence: 'Der Fahrplan hat sich seit letzter Woche geändert.', difficulty: 'Medium' },
    { word: 'Gepäckaufgabe', article: 'die', plural: 'die Gepäckaufgaben', translation: 'baggage drop-off', exampleSentence: 'Die Gepäckaufgabe schließt 45 Minuten vor Abflug.', difficulty: 'Hard' },
    { word: 'Schalter', article: 'der', plural: 'die Schalter', translation: 'counter, ticket window', exampleSentence: 'Bitte melden Sie sich am Schalter 4.', difficulty: 'Medium' },
    { word: 'Reisepass', article: 'der', plural: 'die Reisepässe', translation: 'passport', exampleSentence: 'Vergessen Sie nicht Ihren Reisepass.', difficulty: 'Easy' },
    { word: 'Umsteigen', article: 'das', plural: '—', translation: 'changing trains / transfer', exampleSentence: 'Das Umsteigen in Frankfurt dauert 15 Minuten.', difficulty: 'Medium' },
    { word: 'Verbindung', article: 'die', plural: 'die Verbindungen', translation: 'connection, train connection', exampleSentence: 'Wir haben eine direkte Verbindung nach Berlin.', difficulty: 'Easy' },
    { word: 'Zoll', article: 'der', plural: '—', translation: 'customs', exampleSentence: 'Am Zoll müssen Sie Ihr Gepäck zeigen.', difficulty: 'Medium' },
    { word: 'Bordkarte', article: 'die', plural: 'die Bordkarten', translation: 'boarding pass', exampleSentence: 'Zeigen Sie bitte Ihre Bordkarte am Flugsteig.', difficulty: 'Easy' },
    { word: 'Ankunft', article: 'die', plural: 'die Ankünfte', translation: 'arrival', exampleSentence: 'Die Ankunft ist für 18 Uhr geplant.', difficulty: 'Easy' },
    { word: 'Abflug', article: 'der', plural: 'die Abflüge', translation: 'departure (flight)', exampleSentence: 'Der Abflug verzögert sich wegen des Wetters.', difficulty: 'Medium' },
  ],
  Food: [
    { word: 'Speisekarte', article: 'die', plural: 'die Speisekarten', translation: 'menu', exampleSentence: 'Können wir bitte die Speisekarte haben?', difficulty: 'Easy' },
    { word: 'Rechnung', article: 'die', plural: 'die Rechnungen', translation: 'bill, check', exampleSentence: 'Wir möchten bitte bezahlen und die Rechnung haben.', difficulty: 'Easy' },
    { word: 'Kellner', article: 'der', plural: 'die Kellner', translation: 'waiter', exampleSentence: 'Der Kellner bringt uns das Wasser.', difficulty: 'Easy' },
    { word: 'Gericht', article: 'das', plural: 'die Gerichte', translation: 'dish, meal', exampleSentence: 'Dieses Gericht schmeckt fantastisch.', difficulty: 'Medium' },
  ]
};

export const aiService = {
  async generateVocabulary(req: AIGenerationRequest): Promise<Partial<VocabularyWord>[]> {
    await delay(1200);
    const pool = mockAIPool[req.topic] || mockAIPool['Travel'];
    
    return pool.slice(0, req.wordCount || 10).map((item, index) => ({
      id: `ai-gen-${Date.now()}-${index}`,
      word: item.word,
      article: item.article,
      plural: item.plural,
      translation: item.translation,
      exampleSentence: item.exampleSentence,
      difficulty: item.difficulty || req.difficulty,
      topic: req.topic,
      dayNumber: 4,
      status: 'Draft',
    }));
  }
};
