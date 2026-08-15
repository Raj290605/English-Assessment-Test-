require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting exact backfill for QuestionResponse promptSnapshot...');

  try {
    // Verify total QuestionResponse count before
    const countBeforeResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "question_responses";`);
    const countBefore = Number(countBeforeResult[0].c);
    
    // Execute safe pure SQL backfill mapping question text exactly to the snapshot
    await prisma.$executeRawUnsafe(`
      UPDATE "question_responses" qr
      SET "promptSnapshot" = q."promptText"
      FROM "questions" q
      WHERE qr."questionId" = q.id AND qr."promptSnapshot" IS NULL;
    `);

    // Verify total QuestionResponse count after
    const countAfterResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "question_responses";`);
    const countAfter = Number(countAfterResult[0].c);

    // Verify how many responses now have a non-null promptSnapshot
    const nonNullResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "question_responses" WHERE "promptSnapshot" IS NOT NULL;`);
    const nonNullCount = Number(nonNullResult[0].c);

    console.log(`\n--- VERIFICATION ---`);
    console.log(`QuestionResponse Count Before: ${countBefore}`);
    console.log(`QuestionResponse Count After: ${countAfter}`);
    console.log(`Responses with non-null promptSnapshot: ${nonNullCount}`);
    
    if (countBefore === countAfter && nonNullCount === countAfter) {
      console.log(`\nSUCCESS! Backfill completed perfectly with 0 data loss and exact counts.`);
    } else {
      console.log(`\nWARNING: Counts do not perfectly match expectations.`);
    }
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
