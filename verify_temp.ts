import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const outFile = 'C:/Users/91982/.gemini/antigravity-ide/brain/3c63d520-f3d4-4ff0-83b1-5b33c2bf2180/scratch/db_report.txt';

const prisma = new PrismaClient();
const lines: string[] = [];
function log(s: string) { lines.push(s); }

async function main() {
  log('=== STUDENT ASSESSMENTS ===\n');

  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true, studentId: true, name: true,
      assessments: {
        orderBy: { attemptNumber: 'asc' },
        select: {
          id: true, attemptNumber: true, status: true,
          submittedAt: true, createdAt: true,
          evaluation: { select: { overallScore: true } },
          responses: { select: { id: true } },
          questions: { select: { id: true } },
        },
      },
    },
    orderBy: { studentId: 'asc' },
  });

  for (const u of users) {
    log(`\n-- ${u.name} (studentId: ${u.studentId}) [userId: ${u.id}]`);
    if (u.assessments.length === 0) {
      log('   (no assessments)');
    }
    for (const a of u.assessments) {
      const score = a.evaluation?.overallScore != null ? `${a.evaluation.overallScore}/10` : '-';
      const sub = a.submittedAt ? a.submittedAt.toISOString().slice(0,10) : 'not-submitted';
      log(`   Attempt #${a.attemptNumber} | id: ${a.id} | status: ${a.status} | score: ${score} | responses: ${a.responses.length} | assessmentQuestions: ${a.questions.length} | submitted: ${sub}`);
    }
  }

  log('\n\n=== INTEGRITY CHECK ===\n');
  let allOk = true;
  for (const u of users) {
    const nums = u.assessments.map(a => a.attemptNumber).sort((x,y) => x-y);
    if (nums.some(n => n <= 0)) { log(`FAIL: negative for ${u.studentId}: [${nums}]`); allOk=false; }
    const uniq = new Set(nums);
    if (uniq.size !== nums.length) { log(`FAIL: duplicate for ${u.studentId}: [${nums}]`); allOk=false; }
    for (let i=0; i<nums.length; i++) {
      if (nums[i] !== i+1) { log(`FAIL: gap for ${u.studentId}: got [${nums.join(', ')}] expected [${nums.map((_,idx) => idx+1).join(', ')}]`); allOk=false; break; }
    }
  }
  if (allOk) log('PASS: No negatives, no duplicates, no gaps.');

  log('\n\n=== QUESTION BANK ===\n');
  const qs = await prisma.question.findMany({ orderBy: { questionNumber: 'asc' } });
  log(`Total questions: ${qs.length}`);
  for (const q of qs) {
    const p = q.promptText.length > 80 ? q.promptText.slice(0,80)+'...' : q.promptText;
    log(`  Q${q.questionNumber} [isActive=${q.isActive}]: ${p}`);
  }

  await prisma.$disconnect();
  fs.writeFileSync(outFile, lines.join('\n'));
}

main().catch(e => {
  fs.writeFileSync(outFile, 'ERROR: ' + e.message + '\n' + e.stack);
  process.exit(1);
});
