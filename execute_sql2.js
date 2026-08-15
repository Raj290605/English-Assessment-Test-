require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Executing additive SQL changes manually...');
  console.log('DB URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not loaded');

  try {
    // 1. Add promptSnapshot
    await prisma.$executeRawUnsafe(`ALTER TABLE "question_responses" ADD COLUMN IF NOT EXISTS "promptSnapshot" TEXT;`);
    console.log('Added promptSnapshot to question_responses');

    // 2. Add isActive
    await prisma.$executeRawUnsafe(`ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;`);
    console.log('Added isActive to questions');

    // Verification
    console.log('\n--- VERIFICATION ---');
    
    const qrCountResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "question_responses";`);
    const qCountResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "questions";`);
    
    console.log(`QuestionResponse Total Rows: ${Number(qrCountResult[0].c)}`);
    console.log(`Question Total Rows: ${Number(qCountResult[0].c)}`);

    const qActiveResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "questions" WHERE "isActive" = true;`);
    console.log(`Questions with isActive=true: ${Number(qActiveResult[0].c)}`);

    // Verify columns exist by querying them directly
    const testQR = await prisma.$queryRawUnsafe(`SELECT "promptSnapshot" FROM "question_responses" LIMIT 1;`);
    console.log(`Verified promptSnapshot column exists. Value: ${testQR.length > 0 ? testQR[0].promptSnapshot : 'N/A'}`);

    console.log('\nSUCCESS!');

  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
