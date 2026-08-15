// Plain CommonJS — uses the already-compiled Prisma JS client from node_modules
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const outFile = path.join(__dirname, 'db_report.txt');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_9EkJbGQ1sKZD@ep-curly-tree-az1g44up.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' } }
});

const lines = [];
function log(s) { lines.push(s); process.stdout.write(s + '\n'); }

async function main() {
  log('=== PRE-TEST DB SNAPSHOT ===\n');

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

  log(`Total STUDENT accounts: ${users.length}\n`);

  for (const u of users) {
    log(`STUDENT: ${u.name} | studentId: ${u.studentId} | userId: ${u.id}`);
    if (u.assessments.length === 0) {
      log('  (no assessments)');
    }
    for (const a of u.assessments) {
      const score = a.evaluation?.overallScore != null ? `${a.evaluation.overallScore}/10` : 'no-score';
      const sub = a.submittedAt ? a.submittedAt.toISOString().slice(0,10) : 'not-submitted';
      log(`  Attempt#${a.attemptNumber} id=${a.id} status=${a.status} score=${score} responses=${a.responses.length} aqRecords=${a.questions.length} submitted=${sub}`);
    }
    log('');
  }

  // ─── Integrity check ────────────────────────────────────────────────
  log('=== INTEGRITY CHECK ===\n');
  let allOk = true;
  for (const u of users) {
    const nums = u.assessments.map(a => a.attemptNumber).sort((x, y) => x - y);
    if (nums.some(n => n <= 0)) { log(`FAIL:negative studentId=${u.studentId} nums=[${nums}]`); allOk = false; }
    const uniq = new Set(nums);
    if (uniq.size !== nums.length) { log(`FAIL:duplicate studentId=${u.studentId} nums=[${nums}]`); allOk = false; }
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] !== i + 1) { log(`FAIL:gap studentId=${u.studentId} got=[${nums.join(',')}]`); allOk = false; break; }
    }
  }
  if (allOk) log('PASS: All attempt sequences are valid (no negatives, no duplicates, no gaps).\n');
  else log('');

  // ─── Question Bank ────────────────────────────────────────────────────
  log('=== QUESTION BANK ===\n');
  const qs = await prisma.question.findMany({ orderBy: { questionNumber: 'asc' } });
  log(`Total questions: ${qs.length}`);
  for (const q of qs) {
    const preview = q.promptText.length > 80 ? q.promptText.slice(0, 80) + '...' : q.promptText;
    log(`  Q${q.questionNumber} [active=${q.isActive}]: ${preview}`);
  }

  await prisma.$disconnect();
  fs.writeFileSync(outFile, lines.join('\n'));
  log('\nReport written: ' + outFile);
}

main().catch(e => {
  const msg = 'ERROR: ' + e.message + '\n' + e.stack;
  fs.writeFileSync(outFile, msg);
  process.stderr.write(msg + '\n');
  process.exit(1);
});
