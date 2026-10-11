import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

function generateGrievanceCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `GR${num}`;
}

// POST /api/grievance — file a new grievance
export async function POST(request) {
  try {
    const { phone, category, description } = await request.json();

    if (!phone || !description) {
      return NextResponse.json({ error: 'phone and description are required' }, { status: 400 });
    }

    const grievanceCode = generateGrievanceCode();

    const { error } = await supabase.from('grievances').insert({
      grievance_code: grievanceCode,
      phone_number: phone,
      category,
      description,
      status: 'submitted',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      // Still return the code so the demo flow works even if DB isn't set up yet
      return NextResponse.json({ grievanceCode, warning: 'Not saved to database — check Supabase setup' });
    }

    // TODO: send SMS confirmation via Twilio here

    return NextResponse.json({ grievanceCode });
  } catch (err) {
    console.error('Grievance filing error:', err);
    return NextResponse.json({ error: 'Something went wrong filing your grievance' }, { status: 500 });
  }
}

// GET /api/grievance?code=GR1023 — check status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'code is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grievances')
      .select('status, category, description, created_at')
      .eq('grievance_code', code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'No grievance found with that number' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Grievance lookup error:', err);
    return NextResponse.json({ error: 'Something went wrong looking up your grievance' }, { status: 500 });
  }
}
