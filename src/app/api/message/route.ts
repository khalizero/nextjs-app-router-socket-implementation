// src/app/api/messages/route.ts (App Router version)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'roomId is required' }, { status: 400 });

  await connectDB();
  const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
  return NextResponse.json(messages);
}
