import { NextResponse } from 'next/server';
import { askGemini } from '@/lib/geminiClient';

// TODO: replace with real OCR (Tesseract.js or Google Cloud Vision) once ready.
// For now this stubs extracted text so the rest of the pipeline (Gemini
// summarization + deadline extraction) can be built and tested.
async function runOCR(fileBuffer) {
  return `NOTICE OF DUES — Sample Cooperative Society Ltd.
Member ID: 4521. This is to inform you that your outstanding society
maintenance dues of Rs. 3,200 must be cleared by 15 November 2026, failing
which a late penalty of Rs. 200 will be applied as per society by-law 14(2).`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('document');

    if (!file) {
      return NextResponse.json({ error: 'No document provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await runOCR(Buffer.from(arrayBuffer));

    const prompt = `The following text was extracted from a scanned document using OCR.
It may contain minor errors. Do three things:
1. Classify the document type in a few words (e.g. "Cooperative society notice", "Government scheme form", "Utility bill").
2. Summarize it in 2-3 simple sentences, plain language, no jargon.
3. If there is a deadline or due date mentioned, extract it in DD Month YYYY format. If none, say "none".

Respond ONLY as JSON in this exact shape, no markdown, no extra text:
{"documentType": "...", "summary": "...", "deadline": "... or none"}

TEXT:
${extractedText}`;

    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { documentType: 'Unknown', summary: raw, deadline: 'none' };
    }

    return NextResponse.json({
      documentType: parsed.documentType,
      summary: parsed.summary,
      deadline: parsed.deadline === 'none' ? null : parsed.deadline,
    });
  } catch (err) {
    console.error('Document analysis error:', err);
    return NextResponse.json({ error: 'Something went wrong analyzing the document' }, { status: 500 });
  }
}
