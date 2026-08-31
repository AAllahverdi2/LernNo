import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPasswordHash = await bcrypt.hash('Allahverdi8574.', 10);
  const demoPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Create Super Admin (Site Owner)
  const admin = await prisma.user.upsert({
    where: { email: 'agamaliyevallahverdii@gmail.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'Allahverdi Ağamalıyev (Super Admin)',
      email: 'agamaliyevallahverdii@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  });

  // 2. Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@demo.com' },
    update: {},
    create: {
      name: 'Dr. Markus Weber',
      email: 'teacher@demo.com',
      passwordHash: demoPasswordHash,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  });

  // 3. Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      name: 'Anna Miller',
      email: 'student@demo.com',
      passwordHash: demoPasswordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      streak: 7,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log({ admin: admin.email, teacher: teacher.email, student: student.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
