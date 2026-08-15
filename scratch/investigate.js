const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking Assessments count and statuses:");
    const assessments = await prisma.assessment.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });
    console.log(assessments);

    console.log("\nChecking Questions count:");
    const qCount = await prisma.question.count();
    console.log(qCount);

    console.log("\nChecking existing Assessments and their responses:");
    const allAssessments = await prisma.assessment.findMany({
      include: {
        responses: {
          select: { questionId: true, questionNumber: true }
        }
      }
    });
    
    for (const a of allAssessments) {
      console.log(`Assessment ID: ${a.id}, Status: ${a.status}, Responses: ${a.responses.length}`);
      if (a.responses.length > 0) {
        console.log(` - Question IDs: ${a.responses.map(r => r.questionId).join(', ')}`);
        console.log(` - Question Numbers: ${a.responses.map(r => r.questionNumber).join(', ')}`);
      }
    }

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
