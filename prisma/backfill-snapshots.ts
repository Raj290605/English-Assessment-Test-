import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting backfill for QuestionResponse promptSnapshot...');

  const responses = await prisma.questionResponse.findMany({
    include: { question: true },
  });

  console.log(`Found ${responses.length} responses to evaluate.`);

  let updatedCount = 0;

  for (const response of responses) {
    if (!response.promptSnapshot && response.question) {
      await prisma.questionResponse.update({
        where: { id: response.id },
        data: { promptSnapshot: response.question.promptText },
      });
      updatedCount++;
    }
  }

  console.log(`Backfill complete. Updated ${updatedCount} existing responses with current prompt snapshots.`);
}

main()
  .catch((e) => {
    console.error('Error during backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
