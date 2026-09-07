import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { EnquiryStatus } from '@prisma/client';

// ── GET /api/admin/enquiries ──────────────────────────────────────────────────
// Returns paginated enquiries with optional search and status filter.

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const statusFilter = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // ── Build where clause ────────────────────────────────────────────────

    const where: any = {};

    // Status filter
    if (statusFilter && Object.values(EnquiryStatus).includes(statusFilter as EnquiryStatus)) {
      where.status = statusFilter as EnquiryStatus;
    }

    // Search across name, phone, email
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // ── Query ─────────────────────────────────────────────────────────────

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          interestedService: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      enquiries: enquiries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('[GET /api/admin/enquiries]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
