import { NextResponse } from 'next/server';
import { detectContentSubjectAndTopic } from '@/lib/groq-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content: string = body.content || '';

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const result = await detectContentSubjectAndTopic(content);
    return NextResponse.json({ success: true, subject: result.subject, topic: result.topic });
  } catch (err) {
    console.error('[detect-subject] Error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
