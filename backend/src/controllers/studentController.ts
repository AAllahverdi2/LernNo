import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// GET /api/users/students?search=...
export const getStudentsList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search ? String(req.query.search).toLowerCase() : '';

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        subject: true,
        streak: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Tələbələrin siyahısı yüklənərkən xəta baş verdi.' });
  }
};
