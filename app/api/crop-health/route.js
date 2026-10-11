import { NextResponse } from 'next/server';
import { askGeminiWithImage } from '@/lib/geminiClient';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const prompt = `You are helping a farmer in India. Look at this crop photo.
1. Say what crop it appears to be, if you can tell.
2. Describe any visible problem (disease, pest damage, nutrient deficiency, water stress) in simple words, and say how sure you are.
3. Suggest simple, safe first steps. Do NOT give pesticide brand names or dosages.
4. If the photo is unclear or shows no problem, say so plainly.
Keep it under 120 words, plain language, no jargon.`;

    const answer = await askGeminiWithImage(prompt, buffer.toString('base64'), file.type || 'image/jpeg');
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Crop health error:', err);
    return NextResponse.json({ error: 'Something went wrong checking the image' }, { status: 500 });
  }
}
