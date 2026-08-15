const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(`SELECT "assessmentId", COUNT(*) as c FROM "assessment_questions" GROUP BY "assessmentId"`);
    console.log("Counts per assessment:");
    console.log(res);

    const assessments = await prisma.assessment.findMany({ select: { id: true, status: true } });
    console.log("\nAll assessments:");
    console.log(assessments);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
