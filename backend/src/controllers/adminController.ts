import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        streak: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user list.' });
  }
};

export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      res.status(400).json({ message: 'userId and role are required.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: { role: String(role) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role.' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    if (!userId) {
      res.status(400).json({ message: 'userId parameter is required.' });
      return;
    }
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
};
