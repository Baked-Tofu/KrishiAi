import { NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/bhashiniClient';

export async function POST(request) {
  try {
    const { text, language } = await request.json();
    const audio = await textToSpeech(text, language || 'hi');

    if (!audio) {
      // Bhashini not configured yet — tell frontend to use browser TTS fallback
      return NextResponse.json({ audio: null, fallback: 'browser-speech-synthesis' });
    }

    return NextResponse.json({ audio });
  } catch (err) {
    console.error('TTS API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
