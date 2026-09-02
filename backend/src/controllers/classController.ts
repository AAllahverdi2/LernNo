import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Create a new Class / Group (Müəllim üçün Qrup Yaratmaq)
export const createClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
      res.status(403).json({ message: 'Yalnız Müəllimlər və Adminlər qrup yarada bilər.' });
      return;
    }

    const { name, language, level, schedule, description } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Qrupun adı mütləq daxil edilməlidir.' });
      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        language: language || 'Alman Dili',
        level: level || 'A2',
        schedule: schedule || '1-3-5 Saat 14:00',
        description: description || '',
        teacherId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Qrup uğurla yaradıldı.', class: newClass });
  } catch (error: any) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Qrup yaradılanda xəta baş verdi.' });
  }
};

// 2. Get All Classes created by the logged-in Teacher
export const getTeacherClasses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Sistemə daxil olunmayıb.' });
      return;
    }

    const userId = req.user.id;
    const role = req.user.role;

    let classes: any[] = [];

    if (role === 'ADMIN') {
      classes = await prisma.$queryRaw`
        SELECT 
          c.id, c.name, c.language, c."targetLanguage", c.level, c.schedule, c.description, c."teacherId", c."createdAt", c."updatedAt",
          json_build_object('id', t.id, 'name', t.name, 'email', t.email, 'avatar', t.avatar) AS teacher,
          (SELECT COUNT(*)::int FROM "Enrollment" e WHERE e."classId" = c.id) AS "studentCount",
          (SELECT COUNT(*)::int FROM "Quiz" q WHERE q."classId" = c.id) AS "quizCount",
          (
            SELECT COUNT(*)::int
            FROM "VocabularyWord" vw
            WHERE vw.topic IN (
              SELECT va.topic FROM "ClassVocabularyAssignment" va WHERE va."classId" = c.id
            )
          ) AS "vocabularyCount"
        FROM "Class" c
        JOIN "User" t ON t.id = c."teacherId"
        ORDER BY c."createdAt" DESC;
      `;
    } else if (role === 'STUDENT') {
      classes = await prisma.$queryRaw`
        SELECT 
          c.id, c.name, c.language, c."targetLanguage", c.level, c.schedule, c.description, c."teacherId", c."createdAt", c."updatedAt",
          json_build_object('id', t.id, 'name', t.name, 'email', t.email, 'avatar', t.avatar) AS teacher,
          (SELECT COUNT(*)::int FROM "Enrollment" e WHERE e."classId" = c.id) AS "studentCount",
          (SELECT COUNT(*)::int FROM "Quiz" q WHERE q."classId" = c.id) AS "quizCount",
          (
            SELECT COUNT(*)::int
            FROM "VocabularyWord" vw
            WHERE vw.topic IN (
              SELECT va.topic FROM "ClassVocabularyAssignment" va WHERE va."classId" = c.id
            )
          ) AS "vocabularyCount"
        FROM "Class" c
        JOIN "User" t ON t.id = c."teacherId"
        WHERE c.id IN (
          SELECT en."classId" FROM "Enrollment" en WHERE en."studentId" = ${userId}
        )
        ORDER BY c."createdAt" DESC;
      `;
    } else {
      // TEACHER
      classes = await prisma.$queryRaw`
        SELECT 
          c.id, c.name, c.language, c."targetLanguage", c.level, c.schedule, c.description, c."teacherId", c."createdAt", c."updatedAt",
          json_build_object('id', t.id, 'name', t.name, 'email', t.email, 'avatar', t.avatar) AS teacher,
          (SELECT COUNT(*)::int FROM "Enrollment" e WHERE e."classId" = c.id) AS "studentCount",
          (SELECT COUNT(*)::int FROM "Quiz" q WHERE q."classId" = c.id) AS "quizCount",
          (
            SELECT COUNT(*)::int
            FROM "VocabularyWord" vw
            WHERE vw.topic IN (
              SELECT va.topic FROM "ClassVocabularyAssignment" va WHERE va."classId" = c.id
            )
          ) AS "vocabularyCount"
        FROM "Class" c
        JOIN "User" t ON t.id = c."teacherId"
        WHERE c."teacherId" = ${userId}
        ORDER BY c."createdAt" DESC;
      `;
    }

    const formattedClasses = classes.map((cls) => ({
      ...cls,
      _count: {
        enrollments: cls.studentCount || 0,
        quizzes: cls.quizCount || 0,
        vocabularyWords: cls.vocabularyCount || 0,
      },
    }));

    res.status(200).json({ classes: formattedClasses });
  } catch (error: any) {
    console.error('getTeacherClasses error:', error);
    res.status(500).json({ message: 'Qruplar yüklənəndə xəta baş verdi.' });
  }
};

// 3. Get Class Detail with Students, Vocabulary Count, and Quizzes
export const getClassDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    const results: any[] = await prisma.$queryRaw`
      SELECT 
        c.id, c.name, c.language, c."targetLanguage", c.level, c.schedule, c.description, c."teacherId", c."createdAt", c."updatedAt",
        json_build_object('id', t.id, 'name', t.name, 'email', t.email, 'subject', t.subject, 'avatar', t.avatar) AS teacher,
        (
          SELECT COALESCE(json_agg(json_build_object(
            'id', e.id,
            'status', e.status,
            'student', json_build_object(
              'id', u.id, 'name', u.name, 'email', u.email, 'avatar', u.avatar, 'streak', u.streak
            )
          )), '[]'::json)
          FROM "Enrollment" e
          JOIN "User" u ON u.id = e."studentId"
          WHERE e."classId" = c.id
        ) AS enrollments,
        (
          SELECT COALESCE(json_agg(json_build_object(
            'id', q.id, 'title', q.title, 'totalQuestions', q."totalQuestions", 'passingScore', q."passingScore", 'createdAt', q."createdAt"
          ) ORDER BY q."createdAt" DESC), '[]'::json)
          FROM "Quiz" q
          WHERE q."classId" = c.id
        ) AS quizzes,
        (
          SELECT COUNT(*)::int
          FROM "VocabularyWord" vw
          WHERE vw.topic IN (
            SELECT va.topic FROM "ClassVocabularyAssignment" va WHERE va."classId" = c.id
          )
        ) AS "vocabularyCount"
      FROM "Class" c
      JOIN "User" t ON t.id = c."teacherId"
      WHERE c.id = ${classId}
      LIMIT 1;
    `;

    if (!results || results.length === 0) {
      res.status(404).json({ message: 'Qrup tapılmadı.' });
      return;
    }

    const cls = results[0];

    const responseClass = {
      ...cls,
      vocabularyCount: cls.vocabularyCount || 0,
      _count: {
        enrollments: cls.enrollments?.length || 0,
        quizzes: cls.quizzes?.length || 0,
        vocabularyWords: cls.vocabularyCount || 0,
      },
    };

    res.status(200).json({ class: responseClass });
  } catch (error: any) {
    console.error('getClassDetail error:', error);
    res.status(500).json({ message: 'Qrup detalları yüklənəndə xəta baş verdi.' });
  }
};

// 4. Invite Student to Class (Qrupa Tələbə Dəvət Etmək - PENDING)
export const inviteStudentToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { studentId, email } = req.body;

    if (!studentId && !email) {
      res.status(400).json({ message: 'Tələbənin ID-si və ya e-poçt ünvanı mütləq daxil edilməlidir.' });
      return;
    }

    const student = await prisma.user.findFirst({
      where: studentId ? { id: String(studentId) } : { email: String(email) },
    });

    if (!student) {
      res.status(404).json({ message: 'Bu mənşəli tələbə tapılmadı.' });
      return;
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: student.id,
          classId: String(classId),
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'ACCEPTED') {
        res.status(400).json({ message: 'Bu tələbə artıq qrupun aktiv tələbəsidir.' });
        return;
      }
      if (existingEnrollment.status === 'PENDING') {
        res.status(400).json({ message: 'Bu tələbəyə artıq dəvət göndərilib, cavab gözlənilir.' });
        return;
      }
      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: { status: 'PENDING' },
        include: {
          student: { select: { id: true, name: true, email: true, avatar: true } },
        },
      });
      res.status(200).json({ message: 'Tələbəyə yenidən dəvət göndərildi.', enrollment: updatedEnrollment });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: String(classId),
        status: 'PENDING',
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.status(201).json({ message: 'Tələbəyə qrup dəvəti göndərildi.', enrollment });
  } catch (error: any) {
    res.status(500).json({ message: 'Tələbəyə dəvət göndəriləndə xəta baş verdi.' });
  }
};

// 7. Get Pending Invitations for Logged-in Student
export const getMyInvitations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Sistemə daxil olunmayıb.' });
      return;
    }

    const invitations = await prisma.enrollment.findMany({
      where: {
        studentId: req.user.id,
        status: 'PENDING',
      },
      include: {
        class: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, avatar: true, subject: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ invitations });
  } catch (error: any) {
    res.status(500).json({ message: 'Dəvətlər yüklənərkən xəta baş verdi.' });
  }
};

// 8. Respond to Class Invitation (Qəbul et / İmtina et)
export const respondToInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;
    const { action } = req.body;

    if (!action || !['ACCEPT', 'REJECT'].includes(action)) {
      res.status(400).json({ message: 'Qərar "ACCEPT" və ya "REJECT" olmalıdır.' });
      return;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: String(enrollmentId) },
    });

    if (!enrollment || enrollment.studentId !== req.user?.id) {
      res.status(404).json({ message: 'Dəvət tapılmadı və ya sizə aid deyil.' });
      return;
    }

    if (action === 'ACCEPT') {
      const updated = await prisma.enrollment.update({
        where: { id: String(enrollmentId) },
        data: { status: 'ACCEPTED' },
      });
      res.status(200).json({ message: 'Dəvət qəbul edildi. Artıq qrupa üzvsünüz!', enrollment: updated });
    } else {
      await prisma.enrollment.delete({
        where: { id: String(enrollmentId) },
      });
      res.status(200).json({ message: 'Dəvətdən imtina edildi.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Cavab göndərilərkən xəta baş verdi.' });
  }
};

// 4.9 Get Lightweight Vocabulary & Categories for a Class from Database
export const getVocabularyByClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { classId } = req.params;
    const { page = 1, limit = 50, topic, search, language, master } = req.query;
    const userId = req.user?.id;

    // Find all class IDs belonging to this user (teacher classes or student enrolled classes)
    let userClassIds: string[] = [];
    if (req.user?.role === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        select: { classId: true },
      });
      userClassIds = enrollments.map((e) => e.classId);
    } else if (userId) {
      const teacherClasses = await prisma.class.findMany({
        where: { teacherId: userId },
        select: { id: true },
      });
      userClassIds = teacherClasses.map((c) => c.id);
    }

    let actualClassId = String(classId || '');
    if ((!actualClassId || actualClassId === 'default' || actualClassId === 'master') && userClassIds.length > 0) {
      actualClassId = userClassIds[0];
    }

    const isMaster = master === 'true' || classId === 'master' || req.query.isMaster === 'true';

    // Prepare filter clause
    const whereClause: any = {};

    if (isMaster && req.user?.role !== 'STUDENT') {
      // Return all master vocabulary words for this teacher across all their classes
      if (userClassIds.length > 0) {
        whereClause.classId = { in: userClassIds };
      }
    } else {
      // In a specific class view or student view: filter strictly by topics assigned to this class
      const targetClassIds = actualClassId ? [actualClassId] : userClassIds;
      const assignments = await prisma.classVocabularyAssignment.findMany({
        where: { classId: { in: targetClassIds } },
        select: { topic: true },
      });
      const assignedTopicNames = assignments.map((a) => a.topic);
      whereClause.topic = { in: assignedTopicNames };
    }

    if (topic && String(topic).trim() !== '') {
      whereClause.topic = String(topic);
    }
    if (language && String(language).trim() !== '') {
      whereClause.language = String(language);
    }
    if (search && String(search).trim() !== '') {
      whereClause.OR = [
        { word: { contains: String(search), mode: 'insensitive' } },
        { translation: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(10, Number(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Run unified groupBy query and words query in parallel!
    const [topicAndLangCounts, words] = await Promise.all([
      prisma.vocabularyWord.groupBy({
        by: ['topic', 'language'],
        where: whereClause,
        _count: { _all: true },
      }),
      // Only fetch word list if viewing a specific topic or active search
      topic || search
        ? prisma.vocabularyWord.findMany({
            where: whereClause,
            select: {
              id: true,
              word: true,
              translation: true,
              article: true,
              topic: true,
              language: true,
              targetLanguage: true,
            },
            orderBy: { word: 'asc' },
            skip,
            take: limitNum,
          })
        : Promise.resolve([]),
    ]);

    const topicMap = new Map<string, number>();
    const langMap = new Map<string, number>();
    let totalWords = 0;

    for (const item of topicAndLangCounts) {
      const tName = item.topic || 'Ümumi';
      const lName = item.language || 'Alman Dili';
      const count = item._count._all;
      totalWords += count;
      topicMap.set(tName, (topicMap.get(tName) || 0) + count);
      langMap.set(lName, (langMap.get(lName) || 0) + count);
    }

    const categoriesData = Array.from(topicMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    const categoryNames = categoriesData.map((c) => c.name);

    const languagesData = Array.from(langMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    const languageNames = languagesData.map((l) => l.name);

    res.status(200).json({
      words,
      categories: categoryNames,
      categoriesData,
      languages: languageNames,
      languagesData,
      total: totalWords,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalWords / limitNum),
      classId: actualClassId,
    });
  } catch (error: any) {
    console.error('getVocabularyByClass error:', error);
    res.status(500).json({ message: 'Lüğət yüklənərkən xəta baş verdi.' });
  }
};

// 5. Add Vocabulary / Assignment Word to Class
export const addVocabularyToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { classId } = req.params;
    const { word, translation, article, plural, exampleSentence, topic, difficulty, language, targetLanguage } = req.body;
    const userId = req.user?.id;

    if (!word || !translation) {
      res.status(400).json({ message: 'Söz və tərcümə mütləq daxil edilməlidir.' });
      return;
    }

    let targetClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!targetClass && userId) {
      targetClass = await prisma.class.findFirst({ where: { teacherId: userId } });
      if (!targetClass) {
        targetClass = await prisma.class.create({
          data: {
            name: 'Alman Dili (A2)',
            language: language || 'Alman Dili',
            targetLanguage: targetLanguage || 'Azərbaycan Dili',
            level: 'A2',
            schedule: 'Həftəiçi 14:00',
            teacherId: userId,
          },
        });
      }
    }

    const assignedLanguage = language || targetClass?.language || 'Alman Dili';
    const assignedTargetLanguage = targetLanguage || targetClass?.targetLanguage || 'Azərbaycan Dili';
    const finalClassId = targetClass ? targetClass.id : String(classId);
    const finalTopic = topic || 'Ümumi';

    const newWord = await prisma.vocabularyWord.create({
      data: {
        classId: finalClassId,
        word,
        translation,
        article: article || '',
        plural: plural || '',
        language: assignedLanguage,
        targetLanguage: assignedTargetLanguage,
        exampleSentence: exampleSentence || `${word} - ${translation}`,
        topic: finalTopic,
        difficulty: difficulty || 'Medium',
      },
    });

    // Auto-upsert topic into ClassVocabularyAssignment table for this class
    if (finalClassId && finalTopic) {
      await prisma.classVocabularyAssignment.upsert({
        where: {
          classId_topic_language: {
            classId: finalClassId,
            topic: finalTopic,
            language: assignedLanguage,
          },
        },
        create: {
          classId: finalClassId,
          topic: finalTopic,
          language: assignedLanguage,
        },
        update: {},
      }).catch((err) => console.log('Auto assignment info:', err.message));
    }

    res.status(201).json({ message: 'Söz uğurla əlavə edildi.', word: newWord });
  } catch (error: any) {
    console.error('addVocabularyToClass error:', error);
    res.status(500).json({ message: error.message || 'Söz əlavə ediləndə xəta baş verdi.' });
  }
};

// 5.1 Batch Add Vocabulary Words (Kütləvi Copy-Paste Sözlər)
export const batchAddVocabularyToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { classId } = req.params;
    const { words, topic, language, targetLanguage } = req.body;
    const userId = req.user?.id;

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({ message: 'Ən azı 1 söz daxil edilməlidir.' });
      return;
    }

    // Resolve real class from database
    let targetClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!targetClass && userId) {
      targetClass = await prisma.class.findFirst({ where: { teacherId: userId } });
      if (!targetClass) {
        targetClass = await prisma.class.create({
          data: {
            name: 'Alman Dili (A2)',
            language: language || 'Alman Dili',
            targetLanguage: targetLanguage || 'Azərbaycan Dili',
            level: 'A2',
            schedule: 'Həftəiçi 14:00',
            teacherId: userId,
          },
        });
      }
    }

    if (!targetClass) {
      res.status(404).json({ message: 'Qrup tapılmadı və ya yaradıla bilmədi.' });
      return;
    }

    const actualClassId = targetClass.id;
    const defaultTopic = topic || 'Ümumi';
    const defaultLanguage = language || targetClass.language || 'Alman Dili';
    const defaultTargetLanguage = targetLanguage || targetClass.targetLanguage || 'Azərbaycan Dili';

    // Use Prisma transaction or createMany with UUIDs
    const created = await prisma.vocabularyWord.createMany({
      data: words.map((w: any) => ({
        classId: actualClassId,
        word: String(w.word || '').trim(),
        translation: String(w.translation || '').trim(),
        article: String(w.article || '').trim(),
        plural: String(w.plural || '').trim(),
        language: String(w.language || defaultLanguage).trim(),
        targetLanguage: String(w.targetLanguage || defaultTargetLanguage).trim(),
        exampleSentence: String(w.exampleSentence || `${w.word} - ${w.translation}`).trim(),
        topic: String(w.topic || defaultTopic).trim(),
        difficulty: String(w.difficulty || 'Medium').trim(),
      })),
    });

    res.status(201).json({
      message: `${created.count} söz uğurla daxil edildi.`,
      count: created.count,
      classId: actualClassId,
    });
  } catch (error: any) {
    console.error('Batch add vocabulary error:', error);
    res.status(500).json({ message: error.message || 'Kütləvi sözlər əlavə edilərkən xəta baş verdi.' });
  }
};

// 5.2 Delete Vocabulary Word
export const deleteVocabularyWord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.params;
    await prisma.vocabularyWord.deleteMany({ where: { id: String(wordId) } });
    res.status(200).json({ message: 'Söz silindi.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Söz silinərkən xəta baş verdi.' });
  }
};

// 5.3 Delete Entire Vocabulary Topic/Dictionary (Lüğəti Silmək və ya Qrupdan Çıxarmaq)
export const deleteVocabularyTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { classId } = req.params;
    const { topic, language, unassignOnly } = req.query;
    const userId = req.user?.id;

    if (!topic) {
      res.status(400).json({ message: 'Silinəcək lüğətin (mövzunun) adı qeyd edilməlidir.' });
      return;
    }

    let targetClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!targetClass && userId) {
      targetClass = await prisma.class.findFirst({ where: { teacherId: userId } });
    }

    const actualClassId = targetClass ? targetClass.id : String(classId);

    // If unassignOnly is requested (e.g. from Class Detail view)
    if (unassignOnly === 'true' || String(unassignOnly) === 'true') {
      await prisma.classVocabularyAssignment.deleteMany({
        where: {
          classId: actualClassId,
          topic: String(topic),
        },
      });
      res.status(200).json({ message: `'${topic}' lüğəti bu qrupdan çıxarıldı (Ümumi bazanızda saxlanıldı).` });
      return;
    }

    // Otherwise, delete assignment and words globally
    await prisma.classVocabularyAssignment.deleteMany({
      where: {
        topic: String(topic),
      },
    });

    const whereClause: any = {
      topic: String(topic),
    };

    if (language) {
      whereClause.language = String(language);
    }

    const deleted = await prisma.vocabularyWord.deleteMany({
      where: whereClause,
    });

    res.status(200).json({
      message: `'${topic}' lüğəti və daxilindəki ${deleted.count} söz uğurla silindi.`,
      count: deleted.count,
    });
  } catch (error: any) {
    console.error('deleteVocabularyTopic error:', error);
    res.status(500).json({ message: 'Lüğət silinərkən xəta baş verdi.' });
  }
};

// 5.4 Assign Topics / Dictionaries to a Class (Qrupa Lüğətlərin Təyin Edilməsi)
export const assignTopicsToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { topics } = req.body; // array of topic strings e.g. ["Ailə Və Məişət", "Səyahət"]

    if (!Array.isArray(topics)) {
      res.status(400).json({ message: 'Təyin ediləcək lüğətlər siyahısı (array) daxil edilməlidir.' });
      return;
    }

    const targetClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!targetClass) {
      res.status(404).json({ message: 'Qrup tapılmadı.' });
      return;
    }

    // 1. Delete old assignments for this class
    await prisma.classVocabularyAssignment.deleteMany({
      where: { classId: String(classId) },
    });

    // 2. Create new assignment records
    if (topics.length > 0) {
      await prisma.classVocabularyAssignment.createMany({
        data: topics.map((t: string) => ({
          classId: String(classId),
          topic: String(t).trim(),
          language: targetClass.language || 'Alman Dili',
        })),
      });
    }

    res.status(200).json({
      message: 'Qrup lüğətləri uğurla təyin edildi.',
      assignedTopics: topics,
    });
  } catch (error: any) {
    console.error('assignTopicsToClass error:', error);
    res.status(500).json({ message: 'Qrupa lüğət təyin edilərkən xəta baş verdi.' });
  }
};

// 5.5 Get Assigned Topics for a Class
export const getClassAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const assignments = await prisma.classVocabularyAssignment.findMany({
      where: { classId: String(classId) },
      select: { topic: true, language: true },
    });

    const assignedTopics = assignments.map((a) => a.topic);
    res.status(200).json({ assignedTopics, assignments });
  } catch (error: any) {
    res.status(500).json({ message: 'Qrup təyinatları yüklənərkən xəta baş verdi.' });
  }
};

// 6. Create Quiz / Exam inside Class (Sınaq Yaradılması)
export const createQuizInClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { title, totalQuestions, passingScore } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Sınaq imtahanının başlığı mütləq daxil edilməlidir.' });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        classId: String(classId),
        title,
        totalQuestions: totalQuestions || 10,
        passingScore: passingScore || 70,
      },
    });

    res.status(201).json({ message: 'Sınaq imtahanı uğurla yaradıldı.', quiz });
  } catch (error: any) {
    res.status(500).json({ message: 'Sınaq yaradılanda xəta baş verdi.' });
  }
};

// 7. Update Class details (Qrupa Düzəliş Etmək)
export const updateClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { name, language, level, schedule, description } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!existingClass) {
      res.status(404).json({ message: 'Qrup tapılmadı.' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existingClass.teacherId !== req.user?.id) {
      res.status(403).json({ message: 'Yalnız öz qrupunuzda düzəliş edə bilərsiniz.' });
      return;
    }

    const updatedClass = await prisma.class.update({
      where: { id: String(classId) },
      data: {
        name: name || existingClass.name,
        language: language || existingClass.language,
        level: level || existingClass.level,
        schedule: schedule !== undefined ? schedule : existingClass.schedule,
        description: description !== undefined ? description : existingClass.description,
      },
    });

    res.status(200).json({ message: 'Qrup məlumatları yeniləndi.', class: updatedClass });
  } catch (error: any) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Qrupa düzəliş edilərkən xəta baş verdi.' });
  }
};

// 8. Delete Class (Qrupu Silmək)
export const deleteClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const userId = req.user?.id;

    const whereClause: any = { id: String(classId) };
    if (req.user?.role !== 'ADMIN') {
      whereClause.teacherId = userId;
    }

    // Atomic cascade delete in PostgreSQL (1 single query)
    const result = await prisma.class.deleteMany({ where: whereClause });
    if (result.count === 0) {
      res.status(404).json({ message: 'Qrup tapılmadı və ya silmə icazəniz yoxdur.' });
      return;
    }

    res.status(200).json({ message: 'Qrup uğurla silindi.' });
  } catch (error: any) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Qrup silinərkən xəta baş verdi.' });
  }
};

// 9. Remove Student from Class (Tələbəni Qrupdan Çıxarmaq / Silmək)
export const removeStudentFromClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, studentId } = req.params;

    const existingClass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!existingClass) {
      res.status(404).json({ message: 'Qrup tapılmadı.' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && existingClass.teacherId !== req.user?.id) {
      res.status(403).json({ message: 'Yalnız öz qrupunuzdan tələbə çıxara bilərsiniz.' });
      return;
    }

    await prisma.enrollment.deleteMany({
      where: {
        classId: String(classId),
        studentId: String(studentId),
      },
    });

    res.status(200).json({ message: 'Tələbə qrupdan uğurla çıxarıldı.' });
  } catch (error: any) {
    console.error('Remove student error:', error);
    res.status(500).json({ message: 'Tələbə qrupdan çıxarılarkən xəta baş verdi.' });
  }
};

