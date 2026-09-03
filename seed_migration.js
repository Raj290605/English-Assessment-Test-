const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration...');

  // 1. Create Question Set A and B
  let setA = await prisma.questionSet.findUnique({ where: { name: 'Question Set A' } });
  if (!setA) {
    setA = await prisma.questionSet.create({
      data: { name: 'Question Set A' },
    });
    console.log('Created Question Set A');
  }

  let setB = await prisma.questionSet.findUnique({ where: { name: 'Question Set B' } });
  if (!setB) {
    setB = await prisma.questionSet.create({
      data: { name: 'Question Set B' },
    });
    console.log('Created Question Set B');
  }

  // 2. Map existing active questions to Set A
  const existingQuestions = await prisma.question.findMany({
    where: { questionSetId: null },
  });

  console.log(`Found ${existingQuestions.length} unassigned questions.`);
  for (const q of existingQuestions) {
    await prisma.question.update({
      where: { id: q.id },
      data: { questionSetId: setA.id },
    });
  }
  console.log('Mapped existing questions to Set A');

  // 3. Assign existing students to Set A
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', questionSetId: null },
  });
  console.log(`Found ${students.length} unassigned students.`);

  for (const student of students) {
    await prisma.user.update({
      where: { id: student.id },
      data: { questionSetId: setA.id },
    });
  }
  console.log('Assigned existing students to Set A');
  console.log('Data migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
