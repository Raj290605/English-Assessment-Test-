const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const assessmentId = 'bfc04620-ea08-4b3d-9b8d-27521788b006';
    const response = await prisma.questionResponse.findFirst({
      where: { assessmentId }
    });
    console.log("IN_PROGRESS Response:", response);
    
    if (response) {
      const q = await prisma.question.findUnique({ where: { id: response.questionId } });
      console.log("\nCurrent Question row for that response:", q);
    }
    
    console.log("\nCurrent active Question Bank (IDs and questionNumber):");
    const activeQs = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
      select: { id: true, questionNumber: true }
    });
    console.log(activeQs.slice(0, 5), `... (${activeQs.length} total)`);

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
