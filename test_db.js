require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB connection...');

  try {
    // Just a basic query to see if it hangs
    const res = await prisma.$queryRawUnsafe(`SELECT 1 as test;`);
    console.log('Connection OK:', res);
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
