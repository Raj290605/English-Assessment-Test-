require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database locks...');
  try {
    const res = await prisma.$queryRawUnsafe(`
      SELECT pid, state, query, wait_event_type, wait_event 
      FROM pg_stat_activity 
      WHERE state != 'idle' AND pid != pg_backend_pid();
    `);
    console.log('Active connections/locks:', res);

    const qCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as c FROM "questions";`);
    console.log(`Question Total Rows: ${Number(qCount[0].c)}`);
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
