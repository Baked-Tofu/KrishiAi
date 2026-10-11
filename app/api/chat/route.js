import { NextResponse } from 'next/server';
import { askGemini } from '@/lib/geminiClient';
import { supabase } from '@/lib/supabaseClient';

// Basic RAG lookup: fetch top matching knowledge_base rows.
// Once pgvector is set up, replace this with a real embedding similarity search
// (supabase.rpc('match_documents', { query_embedding, match_count })).
async function getContext(question) {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('content')
    .textSearch('content', question, { type: 'plain' })
    .limit(3);

  if (error || !data || data.length === 0) return '';
  return data.map((row) => row.content).join('\n\n');
}

export async function POST(request) {
  try {
    const { question, topic } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 });
    }

    const context = await getContext(question);
    const fullQuestion = topic ? `(Topic: ${topic}) ${question}` : question;
    const answer = await askGemini(fullQuestion, context);

    return NextResponse.json({ answer, usedContext: Boolean(context) });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
