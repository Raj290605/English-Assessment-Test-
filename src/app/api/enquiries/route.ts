import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── Validation helpers ────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

// ── POST /api/enquiries ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = body;

    // ── Server-side validation ──────────────────────────────────────────────

    const errors: Record<string, string> = {};

    // Full Name
    const cleanName = typeof name === 'string' ? sanitize(name) : '';
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'Full name is required (at least 2 characters)';
    } else if (cleanName.length > 100) {
      errors.name = 'Full name must not exceed 100 characters';
    }

    // Email
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(cleanEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (cleanEmail.length > 200) {
      errors.email = 'Email address is too long';
    }

    // Phone (optional)
    const cleanPhone = typeof phone === 'string' ? sanitize(phone) : '';
    if (cleanPhone && cleanPhone.length > 20) {
      errors.phone = 'Phone number must not exceed 20 characters';
    }

    // Subject → interestedService
    const cleanSubject = typeof subject === 'string' ? sanitize(subject) : '';
    if (!cleanSubject || cleanSubject.length < 2) {
      errors.subject = 'Subject is required (at least 2 characters)';
    } else if (cleanSubject.length > 200) {
      errors.subject = 'Subject must not exceed 200 characters';
    }

    // Message
    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    if (!cleanMessage || cleanMessage.length < 5) {
      errors.message = 'Message is required (at least 5 characters)';
    } else if (cleanMessage.length > 2000) {
      errors.message = 'Message must not exceed 2000 characters';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // ── Duplicate-submission protection ─────────────────────────────────────
    // Prevent the same email + message from being submitted within 60 seconds.

    const sixtySecondsAgo = new Date(Date.now() - 60_000);
    const duplicate = await prisma.enquiry.findFirst({
      where: {
        email: cleanEmail,
        message: cleanMessage,
        createdAt: { gte: sixtySecondsAgo },
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: 'This enquiry was already submitted. Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }

    // ── Create enquiry ──────────────────────────────────────────────────────

    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone || null,
        interestedService: cleanSubject,
        message: cleanMessage,
        // status defaults to NEW, source defaults to "contact_form"
      },
      select: { id: true },
    });

    return NextResponse.json(
      { success: true, id: enquiry.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST /api/enquiries]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
