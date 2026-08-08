import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const QUESTIONS = [
  {
    questionNumber: 1,
    category: "Self Introduction",
    promptText: "Please introduce yourself, describing your current educational background or career, your interests, and your goals for learning English.",
    timeLimitSec: 90,
  },
  {
    questionNumber: 2,
    category: "Daily Routine",
    promptText: "Describe a typical day in your life. What activities do you do in the morning, afternoon, and evening?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 3,
    category: "Hobbies & Interests",
    promptText: "Talk about a hobby or pastime you enjoy deeply. How did you get started, and why do you find it rewarding?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 4,
    category: "Memorable Experience",
    promptText: "Describe a memorable trip or journey you have taken. Where did you go, who were you with, and what made it special?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 5,
    category: "Opinion & Reasoning",
    promptText: "Some people prefer living in big cities while others prefer small towns. Which do you prefer and why?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 6,
    category: "Technology in Society",
    promptText: "How has technology changed the way people communicate in recent years? Discuss both positive and negative effects.",
    timeLimitSec: 120,
  },
  {
    questionNumber: 7,
    category: "Education & Learning",
    promptText: "What do you think is the most effective way to learn a new language? Describe strategies that work best for you.",
    timeLimitSec: 120,
  },
  {
    questionNumber: 8,
    category: "Problem Solving",
    promptText: "Describe a challenging problem you faced recently at school or work. How did you resolve it and what did you learn?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 9,
    category: "Culture & Celebrations",
    promptText: "Describe an important festival or tradition in your culture. How is it celebrated, and what significance does it hold?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 10,
    category: "Environmental Issues",
    promptText: "What can individuals do in their daily lives to help protect the environment and reduce waste?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 11,
    category: "Career & Ambition",
    promptText: "Where do you see yourself professionally in 5 years? Describe your career aspirations and how you plan to achieve them.",
    timeLimitSec: 120,
  },
  {
    questionNumber: 12,
    category: "Health & Well-being",
    promptText: "How do you maintain a healthy balance between your study or work obligations and personal relaxation?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 13,
    category: "Media & Entertainment",
    promptText: "Talk about a book, movie, or documentary that left a strong impression on you. Summarize the main idea and explain why it inspired you.",
    timeLimitSec: 120,
  },
  {
    questionNumber: 14,
    category: "Describing a Person",
    promptText: "Describe a person who has had a significant influence on your life. Who are they, and what qualities do you admire about them?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 15,
    category: "Hypothetical Scenario",
    promptText: "If you could visit any country in the world for one month with all expenses paid, where would you go and what would you do there?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 16,
    category: "Work & Teamwork",
    promptText: "In your opinion, what are the most important qualities of an effective team member or leader?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 17,
    category: "Social Issues",
    promptText: "Do you think online remote learning is as effective as traditional classroom learning? Explain your viewpoint with examples.",
    timeLimitSec: 120,
  },
  {
    questionNumber: 18,
    category: "Food & Cooking",
    promptText: "Describe your favorite traditional dish. What ingredients are used, and how is it prepared?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 19,
    category: "Shopping & Consumer Behavior",
    promptText: "Do you prefer shopping in physical retail stores or shopping online? Explain the pros and cons of your choice.",
    timeLimitSec: 90,
  },
  {
    questionNumber: 20,
    category: "Time Management",
    promptText: "How do you prioritize your tasks when you have multiple deadlines occurring at the same time?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 21,
    category: "Art & Music",
    promptText: "What role does music or art play in your life? How does it affect your mood or focus?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 22,
    category: "Current Events & News",
    promptText: "How do you stay informed about global news and current events? Why is it important to follow world news?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 23,
    category: "Sports & Fitness",
    promptText: "Discuss the importance of physical fitness or sports in modern life. What activities do you participate in?",
    timeLimitSec: 90,
  },
  {
    questionNumber: 24,
    category: "Reflecting on Progress",
    promptText: "What is a skill you have learned in the past year? How did you practice it, and what obstacles did you overcome?",
    timeLimitSec: 120,
  },
  {
    questionNumber: 25,
    category: "Final Reflections",
    promptText: "Looking ahead, why is mastering English communication important for your personal and professional future?",
    timeLimitSec: 120,
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

  // 3. Create 25 Questions
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
  console.log('25 Assessment Questions seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
