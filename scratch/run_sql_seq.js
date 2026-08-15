const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting and executing SQL sequentially...");

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "assessment_questions" (
        "id" TEXT NOT NULL,
        "assessmentId" TEXT NOT NULL,
        "questionId" TEXT NOT NULL,
        "questionNumber" INTEGER NOT NULL,
        CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log("Table created.");

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "assessment_questions_assessmentId_questionId_key" ON "assessment_questions"("assessmentId", "questionId");
    `);
    console.log("Index 1 created.");

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "assessment_questions_assessmentId_questionNumber_key" ON "assessment_questions"("assessmentId", "questionNumber");
    `);
    console.log("Index 2 created.");

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessment_questions_assessmentId_fkey') THEN
              ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessmentId_fkey" 
              FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    console.log("FK 1 created.");

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessment_questions_questionId_fkey') THEN
              ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_questionId_fkey" 
              FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    console.log("FK 2 created.");

    console.log("SQL execution complete.");
  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
