require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const assessments = await prisma.assessment.findMany({
    include: {
      responses: true
    }
  });
  console.log(`Total assessments: ${assessments.length}`);
  const statusCounts = {};
  assessments.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  console.log('Statuses:', statusCounts);
  
  const inProgress = assessments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'NOT_STARTED');
  console.log(`In progress / Not started: ${inProgress.length}`);
}
main().finally(() => prisma.$disconnect());
