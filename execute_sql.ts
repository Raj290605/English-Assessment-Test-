import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Executing additive SQL changes manually...');

  try {
    // 1. Add promptSnapshot
    await prisma.$executeRawUnsafe(`ALTER TABLE "question_responses" ADD COLUMN IF NOT EXISTS "promptSnapshot" TEXT;`);
    console.log('Added promptSnapshot to question_responses');

    // 2. Add isActive
    await prisma.$executeRawUnsafe(`ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;`);
    console.log('Added isActive to questions');

    // Verification
    console.log('\n--- VERIFICATION ---');
    
    const qrCountResult: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "question_responses";`);
    const qCountResult: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "questions";`);
    
    console.log(`QuestionResponse Total Rows: ${qrCountResult[0].c}`);
    console.log(`Question Total Rows: ${qCountResult[0].c}`);

    const qActiveResult: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "questions" WHERE "isActive" = true;`);
    console.log(`Questions with isActive=true: ${qActiveResult[0].c}`);

    // Verify columns exist by querying them directly
    const testQR: any = await prisma.$queryRawUnsafe(`SELECT "promptSnapshot" FROM "question_responses" LIMIT 1;`);
    console.log(`Verified promptSnapshot column exists. Value: ${testQR.length > 0 ? testQR[0].promptSnapshot : 'N/A'}`);

  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
