import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/authService';
import { prisma } from '@/lib/prisma';
import { EnquiryStatus } from '@prisma/client';

// ── GET /api/admin/enquiries/[id] ─────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      enquiry: {
        ...enquiry,
        createdAt: enquiry.createdAt.toISOString(),
        updatedAt: enquiry.updatedAt.toISOString(),
        contactedAt: enquiry.contactedAt?.toISOString() ?? null,
        followUpAt: enquiry.followUpAt?.toISOString() ?? null,
      },
    });
  } catch (error: any) {
    console.error('[GET /api/admin/enquiries/[id]]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PATCH /api/admin/enquiries/[id] ───────────────────────────────────────────
// Updates status and/or adminNotes for an enquiry.

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the enquiry exists
    const existing = await prisma.enquiry.findUnique({
      where: { id },
      select: { id: true, status: true, contactedAt: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const updateData: any = {};

    // ── Status update ───────────────────────────────────────────────────────

    if (body.status !== undefined) {
      if (!Object.values(EnquiryStatus).includes(body.status as EnquiryStatus)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${Object.values(EnquiryStatus).join(', ')}` },
          { status: 400 }
        );
      }
      updateData.status = body.status as EnquiryStatus;

      // Auto-set contactedAt when first marked as CONTACTED
      if (
        body.status === EnquiryStatus.CONTACTED &&
        !existing.contactedAt
      ) {
        updateData.contactedAt = new Date();
      }
    }

    // ── Admin notes update ──────────────────────────────────────────────────

    if (body.adminNotes !== undefined) {
      const notes = typeof body.adminNotes === 'string' ? body.adminNotes.trim() : '';
      if (notes.length > 5000) {
        return NextResponse.json(
          { error: 'Admin notes must not exceed 5000 characters' },
          { status: 400 }
        );
      }
      updateData.adminNotes = notes || null;
    }

    // ── Follow-up date ──────────────────────────────────────────────────────

    if (body.followUpAt !== undefined) {
      if (body.followUpAt === null) {
        updateData.followUpAt = null;
      } else {
        const parsedDate = new Date(body.followUpAt);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { error: 'Invalid follow-up date' },
            { status: 400 }
          );
        }
        updateData.followUpAt = parsedDate;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // updatedAt is handled automatically by Prisma's @updatedAt

    const updated = await prisma.enquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      enquiry: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        contactedAt: updated.contactedAt?.toISOString() ?? null,
        followUpAt: updated.followUpAt?.toISOString() ?? null,
      },
    });
  } catch (error: any) {
    console.error('[PATCH /api/admin/enquiries/[id]]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
