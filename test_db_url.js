const { PrismaClient } = require('@prisma/client');
const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function main() {
  const prisma = new PrismaClient();
  const response = await prisma.questionResponse.findFirst({
    where: { 
      cloudinaryUrl: { not: '' }
    },
    orderBy: { submissionTimestamp: 'desc' }
  });

  if (!response) {
    console.log("No response found");
    await prisma.$disconnect();
    return;
  }

  const url = response.cloudinaryUrl;
  console.log("DB cloudinaryUrl:", url);

  const req = https.get(url, (res) => {
    console.log("HTTP status:", res.statusCode);
    console.log("Content-Type:", res.headers['content-type']);
    if (res.statusCode >= 400) {
        console.log("X-Cld-Error:", res.headers['x-cld-error']);
    }
  }).on('error', (e) => {
    console.log("Error:", e.message);
  });
  
  await prisma.$disconnect();
}
main().catch(console.error);
