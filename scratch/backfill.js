const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting backfill process...");
  
  // Get active questions
  const activeQuestions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { questionNumber: 'asc' },
    select: { id: true, questionNumber: true }
  });
  console.log(`Found ${activeQuestions.length} active questions.`);

  const assessments = await prisma.assessment.findMany({
    include: {
      responses: {
        select: { questionId: true, questionNumber: true }
      }
    }
  });

  console.log(`Found ${assessments.length} assessments.`);

  try {
    await prisma.$transaction(async (tx) => {
      let totalInserted = 0;

      for (const a of assessments) {
        let inserts = [];
        console.log(`\nProcessing assessment ${a.id} (Status: ${a.status})`);
        
        if (a.status === 'NOT_STARTED') {
          // 20 current active questions
          inserts = activeQuestions.map((q, idx) => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: q.id,
            questionNumber: idx + 1
          }));
          console.log(` -> NOT_STARTED: Generated 20 fallback rows.`);
        } 
        else if (a.status === 'EVALUATED') {
          // exactly the 8 proven questions
          inserts = a.responses.map(r => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: r.questionId,
            questionNumber: r.questionNumber
          }));
          console.log(` -> EVALUATED: Generated ${inserts.length} reconstructed rows.`);
        } 
        else if (a.status === 'IN_PROGRESS') {
          // Preserve known Question #1
          const knownResponses = a.responses;
          const knownIds = knownResponses.map(r => r.questionId);
          inserts = knownResponses.map(r => ({
            id: crypto.randomUUID(),
            assessmentId: a.id,
            questionId: r.questionId,
            questionNumber: r.questionNumber
          }));

          // Fallback for positions 2-20
          let nextQuestionNumber = 2;
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
          console.log(` -> IN_PROGRESS: Generated ${knownResponses.length} reconstructed rows and ${inserts.length - knownResponses.length} fallback rows.`);
        }

        // Execute inserts
        if (inserts.length > 0) {
          for (const row of inserts) {
            await tx.$executeRawUnsafe(`
              INSERT INTO "assessment_questions" ("id", "assessmentId", "questionId", "questionNumber")
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, row.id, row.assessmentId, row.questionId, row.questionNumber);
          }
          totalInserted += inserts.length;
        }
      }

      console.log(`\nTotal rows prepared for insertion: ${totalInserted}`);
      
      const countRes = await tx.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "assessment_questions"`);
      console.log(`Current DB count (inside tx): ${countRes[0].count}`);
    }, { timeout: 30000 });
    
    console.log("Transaction committed successfully.");
    
    // Verify
    const finalCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "assessment_questions"`);
    console.log(`Final AssessmentQuestion row count: ${finalCount[0].count}`);

  } catch (e) {
    console.error("Backfill failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
