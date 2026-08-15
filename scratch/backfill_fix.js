const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log("Fixing backfill data...");
  
  const activeQuestions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { questionNumber: 'asc' },
    select: { id: true, questionNumber: true }
  });

  const assessments = await prisma.assessment.findMany({
    include: {
      responses: {
        select: { questionId: true, questionNumber: true }
      }
    }
  });

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing rows to clear the bad data inserted by the UI
      await tx.$executeRawUnsafe(`DELETE FROM "assessment_questions"`);
      console.log("Deleted all rows from assessment_questions.");

      let totalInserted = 0;

      for (const a of assessments) {
        let inserts = [];
        
        if (a.status === 'NOT_STARTED') {
          inserts = activeQuestions.map((q, idx) => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: q.id,
            questionNumber: idx + 1
          }));
        } 
        else if (a.status === 'EVALUATED') {
          inserts = a.responses.map(r => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: r.questionId,
            questionNumber: r.questionNumber
          }));
        } 
        else if (a.status === 'IN_PROGRESS') {
          const knownResponses = a.responses;
          const knownIds = knownResponses.map(r => r.questionId);
          inserts = knownResponses.map(r => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: r.questionId,
            questionNumber: r.questionNumber
          }));

          let nextQuestionNumber = Math.max(2, ...knownResponses.map(r => r.questionNumber + 1));
          for (const q of activeQuestions) {
            if (!knownIds.includes(q.id)) {
              inserts.push({
                id: crypto.randomUUID(),
                assessmentId: a.id,
                questionId: q.id,
                questionNumber: nextQuestionNumber
              });
              nextQuestionNumber++;
            }
          }
        }

        if (inserts.length > 0) {
          for (const row of inserts) {
            await tx.$executeRawUnsafe(`
              INSERT INTO "assessment_questions" ("id", "assessmentId", "questionId", "questionNumber")
              VALUES ($1, $2, $3, $4)
            `, row.id, row.assessmentId, row.questionId, row.questionNumber);
          }
          totalInserted += inserts.length;
        }
      }

      console.log(`Total rows inserted: ${totalInserted}`);
    }, { timeout: 60000 });
    
    console.log("Transaction committed successfully.");
    const finalCount = await prisma.$queryRawUnsafe(`SELECT "assessmentId", COUNT(*) as c FROM "assessment_questions" GROUP BY "assessmentId"`);
    console.log("Final counts:");
    console.log(finalCount);

  } catch (e) {
    console.error("Backfill failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
