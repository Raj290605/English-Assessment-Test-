import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const QUESTIONS = [
  {
    questionNumber: 1,
    category: "Personal Details",
    promptText: "May I please know your name and your date of birth?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 2,
    category: "Self Introduction",
    promptText: "Tell us something about yourself.",
    timeLimitSec: 90,
  },
  {
    questionNumber: 3,
    category: "Course & University",
    promptText: "What is the course and the university that you have applied for?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 4,
    category: "University Applications",
    promptText: "Have you applied to any other universities?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 5,
    category: "University Choice",
    promptText: "Why did you choose the university? (Comparison is a must)",
    timeLimitSec: 120,
  },
  {
    questionNumber: 6,
    category: "Destination Choice",
    promptText: "Why did you choose the UK? (Comparison is a must)",
    timeLimitSec: 120,
  },
  {
    questionNumber: 7,
    category: "Course Choice",
    promptText: "Why did you choose the course?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 8,
    category: "University Details",
    promptText: "What more do you know about the university? (Address, campuses, facilities, Vice Chancellor, ranking, etc.)",
    timeLimitSec: 120,
  },
  {
    questionNumber: 9,
    category: "Accommodation",
    promptText: "What are your accommodation plans?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 10,
    category: "Accommodation Booking",
    promptText: "How will you book the accommodation?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 11,
    category: "Family & Background",
    promptText: "What about your family income and background?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 12,
    category: "Travel & Logistics",
    promptText: "What about your travel?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 13,
    category: "Career Goals",
    promptText: "What are your future career plans / prospects?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 14,
    category: "Academic Assessment",
    promptText: "How will your course be assessed?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 15,
    category: "Educational History",
    promptText: "Do you have any study gap?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 16,
    category: "Financial Support",
    promptText: "How will you fund your studies?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 17,
    category: "Employment Plans",
    promptText: "Do you wish to work part-time in the UK?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 18,
    category: "Travel Companions",
    promptText: "Is anybody else going to travel with you?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 19,
    category: "Application Agent",
    promptText: "Who is your education agent?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 20,
    category: "UK Contacts & Family",
    promptText: "Do you have any friends & family in the UK?",
    timeLimitSec: 90,
  },
];

async function main() {
  console.log('Seeding Database...');

  // Hash default password
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const studentPasswordHash = await bcrypt.hash('student123', 12);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { studentId: 'admin' },
    update: { passwordHash: adminPasswordHash },
    create: {
      studentId: 'admin',
      name: 'Assessment Administrator',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.studentId);

  // 2. Create Sample Students
  const studentsData = [
    { studentId: 'STU101', name: 'Alex Johnson' },
    { studentId: 'STU102', name: 'Maria Garcia' },
    { studentId: 'STU103', name: 'Chen Wei' },
    { studentId: 'STU104', name: 'Sarah Ahmed' },
    { studentId: 'STU105', name: 'David Kim' },
  ];

  for (const s of studentsData) {
    const student = await prisma.user.upsert({
      where: { studentId: s.studentId },
      update: { name: s.name, passwordHash: studentPasswordHash },
      create: {
        studentId: s.studentId,
        name: s.name,
        passwordHash: studentPasswordHash,
        role: Role.STUDENT,
      },
    });
    console.log(`Student created: ${student.studentId} (${student.name})`);
  }

  // 3. Create 20 Questions
  for (const q of QUESTIONS) {
    await prisma.question.upsert({
      where: { questionNumber: q.questionNumber },
      update: {
        promptText: q.promptText,
        category: q.category,
        timeLimitSec: q.timeLimitSec,
      },
      create: {
        questionNumber: q.questionNumber,
        promptText: q.promptText,
        category: q.category,
        timeLimitSec: q.timeLimitSec,
      },
    });
  }
  console.log('20 Assessment Questions seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
