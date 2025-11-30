import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST() {
  try {
    const userRecord = await auth.createUser({
      email: 'bereketsiyum@gmail.com',
      password: 'B3r3k3tS!yum2024',
      emailVerified: true,
      disabled: false,
    });
    return NextResponse.json({ uid: userRecord.uid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
