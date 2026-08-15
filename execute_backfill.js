require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  try {
    const sql = fs.readFileSync('add_assessment_questions.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      console.log('Executing:', stmt);
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log('SUCCESS! Tables created.');

    // Now backfill all 4 existing assessments
    const assessments = await prisma.assessment.findMany();
    const activeQuestions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' }
    });

    console.log(`Found ${assessments.length} assessments and ${activeQuestions.length} active questions.`);

    let count = 0;
    for (const a of assessments) {
      for (const q of activeQuestions) {
        await prisma.assessmentQuestion.create({
          data: {
            assessmentId: a.id,
            questionId: q.id,
            questionNumber: q.questionNumber
          }
        });
        count++;
      }
    }

    console.log(`Backfill SUCCESS! Inserted ${count} AssessmentQuestion records.`);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
