import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const germanWords = [
  { word: 'Stadt', article: 'die', plural: 'die Städte', translation: 'Şəhər', exampleSentence: 'Berlin ist eine große Stadt in Deutschland.', topic: 'Ort & Stadt' },
  { word: 'eröffnet', article: '', plural: '', translation: 'Açılmış / Açılıb', exampleSentence: 'Das neue Geschäft wird heute eröffnet.', topic: 'Verben & Ereignisse' },
  { word: 'Stadtzentrum', article: 'das', plural: 'die Stadtzentren', translation: 'Şəhər mərkəzi', exampleSentence: 'Wir wohnen mitten im Stadtzentrum.', topic: 'Ort & Stadt' },
  { word: 'Schokoladenkuchen', article: 'der', plural: 'die Schokoladenkuchen', translation: 'Şokoladlı keks / tort', exampleSentence: 'Ich esse sehr gern frischen Schokoladenkuchen.', topic: 'Essen & Trinken' },
  { word: 'Jacke', article: 'die', plural: 'die Jacken', translation: 'Gövdəkcə / Jaket', exampleSentence: 'Es ist kalt, nimm deine warme Jacke mit!', topic: 'Kleidung' },
  { word: 'Buch', article: 'das', plural: 'die Bücher', translation: 'Kitab', exampleSentence: 'Dieses Buch ist sehr interessant und lehrreich.', topic: 'Schule & Studium' },
  { word: 'fünf', article: '', plural: '', translation: 'Beş (5)', exampleSentence: 'Ich habe fünf Bücher für meinen Deutschkurs gekauft.', topic: 'Zahlen & Zeit' },
  { word: 'Café', article: 'das', plural: 'die Cafés', translation: 'Kafe', exampleSentence: 'Treffen wir uns morgen im Café zum Kaffee?', topic: 'Freizeit & Gastronomie' },
];

async function main() {
  console.log('🌱 Seeding German vocabulary words...');

  // Find first class or create default German A2 class
  let defaultClass = await prisma.class.findFirst({
    where: { language: 'Alman Dili' },
  });

  if (!defaultClass) {
    const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
    if (!teacher) {
      console.log('No teacher found for seeding.');
      return;
    }
    defaultClass = await prisma.class.create({
      data: {
        name: 'Alman Dili A2 — 1-3-5 Qrupu',
        language: 'Alman Dili',
        level: 'A2',
        schedule: '1-3-5 Saat 14:00',
        description: 'Alman dili A2 səviyyəli intensiv danışıq və lüğət qrupu.',
        teacherId: teacher.id,
      },
    });
  }

  for (const item of germanWords) {
    await prisma.vocabularyWord.create({
      data: {
        classId: defaultClass.id,
        word: item.word,
        article: item.article,
        plural: item.plural,
        translation: item.translation,
        exampleSentence: item.exampleSentence,
        topic: item.topic,
        difficulty: 'Medium',
      },
    });
  }

  console.log('✅ 8 German vocabulary words successfully seeded into class:', defaultClass.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
