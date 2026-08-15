const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  try {
    const sql = fs.readFileSync('scratch/setup_assessment_questions.sql', 'utf8');
    console.log("Executing SQL...");
    await prisma.$executeRawUnsafe(sql);
    console.log("SQL execution complete.");
  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
