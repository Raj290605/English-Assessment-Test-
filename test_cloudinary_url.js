const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_secret',
  secure: true,
});

async function main() {
  const prisma = new PrismaClient();
  const response = await prisma.questionResponse.findFirst({
    where: { 
      cloudinaryPublicId: { not: '' }
    },
    orderBy: { submissionTimestamp: 'desc' }
  });

  if (!response) {
    console.log("No response found in database with a Cloudinary public ID.");
    await prisma.$disconnect();
    return;
  }

  console.log("--- STEP 1 ---");
  console.log("Public ID:", response.cloudinaryPublicId);
  console.log("Cloudinary URL:", response.cloudinaryUrl);

  console.log("\n--- STEP 2 ---");
  const targetPublicId = response.cloudinaryPublicId;
  
  const originalUrl = cloudinary.url(targetPublicId, {
    resource_type: 'video',
    type: 'authenticated',
    sign_url: true,
    expires_at: 2000000000,
    secure: true,
  });
  console.log("Original URL (no ext):", originalUrl);

  const mp4Url = cloudinary.url(targetPublicId + '.mp4', {
    resource_type: 'video',
    type: 'authenticated',
    sign_url: true,
    expires_at: 2000000000,
    secure: true,
  });
  console.log(".mp4 URL:", mp4Url);

  console.log("\n--- STEP 3 ---");
  const checkUrl = async (urlName, url) => {
    return new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(`\nTesting ${urlName}:`);
        console.log("HTTP status:", res.statusCode);
        console.log("Content-Type:", res.headers['content-type']);
        console.log("Content-Length:", res.headers['content-length']);
        if (res.statusCode === 401 || res.statusCode === 404 || res.statusCode === 403 || res.statusCode === 400) {
            console.log("X-Cld-Error:", res.headers['x-cld-error']);
        }
        resolve();
      }).on('error', (e) => {
        console.log(`Error testing ${urlName}:`, e.message);
        resolve();
      });
    });
  };

  await checkUrl("Original URL (no ext)", originalUrl);
  await checkUrl(".mp4 URL", mp4Url);

  await prisma.$disconnect();
}

main().catch(console.error);
