import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  const phone = new URL(request.url).searchParams.get('phone');
  if (!phone) return NextResponse.json({ error: 'phone is required' }, { status: 400 });

  const { data, error } = await supabase
    .from('deadlines')
    .select('id, document_summary, deadline_date')
    .eq('phone_number', phone)
    .order('deadline_date', { ascending: true });

  if (error) return NextResponse.json({ reminders: [], error: 'Could not load reminders. Check the Supabase setup.' });
  return NextResponse.json({ reminders: data });
}

export async function POST(request) {
  const { phone, note, date } = await request.json();
  if (!phone || !note || !date) {
    return NextResponse.json({ error: 'phone, note and date are required' }, { status: 400 });
  }

  const { error } = await supabase.from('deadlines').insert({
    phone_number: phone,
    document_summary: note,
    deadline_date: date,
  });

  if (error) return NextResponse.json({ error: 'Could not save the reminder. Check the Supabase setup.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
