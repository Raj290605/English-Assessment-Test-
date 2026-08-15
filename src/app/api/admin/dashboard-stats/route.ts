import { NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { Role, AssessmentStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Aggregate counts ────────────────────────────────────────────────────
    const [
      totalStudents,
      pendingReviewCount,
      evaluatedCount,
      inProgressCount,
    ] = await Promise.all([
      // Total registered students (non-admin users)
      prisma.user.count({ where: { role: Role.STUDENT } }),

      // SUBMITTED assessments that do NOT have an OverallEvaluation yet
      prisma.assessment.count({
        where: {
          status: AssessmentStatus.SUBMITTED,
          evaluation: null,
        },
      }),

      // Assessments with status EVALUATED
      prisma.assessment.count({ where: { status: AssessmentStatus.EVALUATED } }),

      // Assessments that are active (in progress or not started)
      prisma.assessment.count({
        where: {
          status: {
            in: [AssessmentStatus.IN_PROGRESS, AssessmentStatus.NOT_STARTED],
          },
        },
      }),
    ]);

    // ── Pending evaluation list (up to 5) ──────────────────────────────────
    // Only SUBMITTED assessments with no evaluation record.
    const pendingAssessments = await prisma.assessment.findMany({
      where: {
        status: AssessmentStatus.SUBMITTED,
        evaluation: null,
      },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      include: {
        student: {
          select: { id: true, studentId: true, name: true },
        },
        responses: {
          select: { id: true },
        },
      },
    });

    const pendingList = pendingAssessments.map((a) => ({
      assessmentId: a.id,
      studentDbId: a.student.id,
      studentId: a.student.studentId,
      studentName: a.student.name,
      attemptNumber: a.attemptNumber,
      submittedAt: a.submittedAt?.toISOString() ?? null,
      responsesCount: a.responses.length,
    }));

    // ── Recent activity (up to 4 real events) ─────────────────────────────
    // Derived only from actual DB timestamps — no fabrication.
    // Sources:
    //   1. Recently EVALUATED assessments  (updatedAt on OverallEvaluation)
    //   2. Recently SUBMITTED assessments  (submittedAt on Assessment)
    //   3. Recently CREATED student users  (createdAt on User)

    const [recentEvaluations, recentSubmissions, recentStudents] =
      await Promise.all([
        prisma.overallEvaluation.findMany({
          orderBy: { updatedAt: 'desc' },
          take: 2,
          include: {
            assessment: {
              include: {
                student: { select: { name: true, studentId: true } },
              },
            },
          },
        }),

        prisma.assessment.findMany({
          where: {
            status: {
              in: [AssessmentStatus.SUBMITTED, AssessmentStatus.EVALUATED],
            },
          },
          orderBy: { submittedAt: 'desc' },
          take: 3,
          include: {
            student: { select: { name: true, studentId: true } },
          },
        }),

        prisma.user.findMany({
          where: { role: Role.STUDENT },
          orderBy: { createdAt: 'desc' },
          take: 2,
          select: { id: true, name: true, studentId: true, createdAt: true },
        }),
      ]);

    // Merge into a unified activity feed, deduplicate, sort by timestamp.
    type ActivityEvent = {
      type: 'evaluated' | 'submitted' | 'student_added';
      studentName: string;
      studentId: string;
      timestamp: string;
    };

    const activityRaw: ActivityEvent[] = [];

    for (const ev of recentEvaluations) {
      activityRaw.push({
        type: 'evaluated',
        studentName: ev.assessment.student.name,
        studentId: ev.assessment.student.studentId,
        timestamp: ev.updatedAt.toISOString(),
      });
    }

    for (const sub of recentSubmissions) {
      if (sub.submittedAt) {
        activityRaw.push({
          type: 'submitted',
          studentName: sub.student.name,
          studentId: sub.student.studentId,
          timestamp: sub.submittedAt.toISOString(),
        });
      }
    }

    for (const stu of recentStudents) {
      activityRaw.push({
        type: 'student_added',
        studentName: stu.name,
        studentId: stu.studentId,
        timestamp: stu.createdAt.toISOString(),
      });
    }

    // Sort descending by timestamp, take top 4, dedupe by (type+studentId)
    const seen = new Set<string>();
    const recentActivity = activityRaw
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .filter((ev) => {
        const key = `${ev.type}:${ev.studentId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 4);

    return NextResponse.json({
      totalStudents,
      pendingReview: pendingReviewCount,
      evaluated: evaluatedCount,
      inProgress: inProgressCount,
      pendingList,
      recentActivity,
    });
  } catch (error: any) {
    console.error('[dashboard-stats]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
