import { NextResponse } from 'next/server';
import { removeSession } from '@/lib/services/authService';

export async function POST() {
  await removeSession();
  return NextResponse.json({ success: true });
}
