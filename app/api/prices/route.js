import { NextResponse } from 'next/server';

// TODO: replace with a real daily-synced pull from Agmarknet / data.gov.in.
// Suggested approach: a scheduled job (cron / Supabase Edge Function) fetches
// the dataset once a day and stores it in a Supabase table, and this route
// just reads from that table (fast, no live dependency on demo day).
// Get your free API key at https://data.gov.in after registering.
const MOCK_PRICES = {
  Telangana: [
    { commodity: 'Tomato', market: 'Bowenpally', modalPrice: 1800, minPrice: 1500, maxPrice: 2200 },
    { commodity: 'Onion', market: 'Bowenpally', modalPrice: 1400, minPrice: 1200, maxPrice: 1600 },
    { commodity: 'Brinjal', market: 'Gudimalkapur', modalPrice: 2000, minPrice: 1700, maxPrice: 2300 },
  ],
  'Andhra Pradesh': [
    { commodity: 'Tomato', market: 'Kurnool', modalPrice: 1700, minPrice: 1400, maxPrice: 2000 },
    { commodity: 'Chilli', market: 'Guntur', modalPrice: 12000, minPrice: 10500, maxPrice: 13500 },
  ],
  Maharashtra: [
    { commodity: 'Onion', market: 'Lasalgaon', modalPrice: 1600, minPrice: 1300, maxPrice: 1900 },
  ],
  Karnataka: [
    { commodity: 'Tomato', market: 'Kolar', modalPrice: 1500, minPrice: 1200, maxPrice: 1800 },
  ],
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'Telangana';

  return NextResponse.json({
    prices: MOCK_PRICES[state] || [],
    updatedAt: new Date().toISOString(),
    source: 'mock-data — replace with Agmarknet/data.gov.in daily sync',
  });
}
