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

    const classes = await prisma.class.findMany({
      where: req.user.role === 'ADMIN' ? {} : { teacherId: req.user.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            vocabularyWords: true,
            quizzes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ classes });
  } catch (error: any) {
    res.status(500).json({ message: 'Qruplar yüklənəndə xəta baş verdi.' });
  }
};

// 3. Get Class Detail with Students, Vocabulary, and Quizzes
export const getClassDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    const classDetail = await prisma.class.findUnique({
      where: { id: String(classId) },
      include: {
        teacher: {
          select: { id: true, name: true, email: true, subject: true, avatar: true },
        },
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, email: true, avatar: true, streak: true },
            },
          },
        },
        vocabularyWords: {
          orderBy: { createdAt: 'desc' },
        },
        quizzes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!classDetail) {
      res.status(404).json({ message: 'Qrup tapılmadı.' });
      return;
    }

    res.status(200).json({ class: classDetail });
  } catch (error: any) {
    res.status(500).json({ message: 'Qrup detalları yüklənəndə xəta baş verdi.' });
  }
};

// 4. Add Student to Class by Email (Qrupa Tələbə Əlavə Etmək)
export const addStudentToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Tələbənin e-poçt ünvanı daxil edilməlidir.' });
      return;
    }

    const student = await prisma.user.findUnique({ where: { email } });
    if (!student) {
      res.status(404).json({ message: 'Bu e-poçt ünvanı ilə istifadəçi tapılmadı.' });
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
      res.status(400).json({ message: 'Bu tələbə artıq qrupa əlavə olunub.' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: String(classId),
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.status(201).json({ message: 'Tələbə qrupa uğurla əlavə edildi.', enrollment });
  } catch (error: any) {
    res.status(500).json({ message: 'Tələbə qrupa əlavə ediləndə xəta baş verdi.' });
  }
};

// 5. Add Vocabulary / Assignment Word to Class
export const addVocabularyToClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { word, translation, article, plural, exampleSentence, topic, difficulty } = req.body;

    if (!word || !translation || !exampleSentence) {
      res.status(400).json({ message: 'Söz, tərcümə və nümunə cümlə mütləq daxil edilməlidir.' });
      return;
    }

    const newWord = await prisma.vocabularyWord.create({
      data: {
        classId: String(classId),
        word,
        translation,
        article: article || '',
        plural: plural || '',
        exampleSentence,
        topic: topic || 'General',
        difficulty: difficulty || 'Medium',
      },
    });

    res.status(201).json({ message: 'Söz/Tapşırıq qrupa uğurla əlavə edildi.', word: newWord });
  } catch (error: any) {
    res.status(500).json({ message: 'Söz əlavə ediləndə xəta baş verdi.' });
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
