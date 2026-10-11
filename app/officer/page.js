'use client';

import { useState } from 'react';
import { Phone, Headset } from 'lucide-react';

export default function OfficerPage() {
  const [phone, setPhone] = useState('');
  const [issue, setIssue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function requestCall() {
    setLoading(true);
    try {
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, category: 'Officer call-back request', description: issue }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B3B24]">Officer Support</h1>
        <p className="text-sm text-[#0B3B24]/70 mt-1">
          When KrishiAi cannot solve your problem, a human officer should help.
        </p>
      </div>

      <a
        href="tel:18001801551"
        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4"
      >
        <span className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-800"><Phone size={22} /></span>
        <span>
          <span className="block font-bold text-[#0B3B24]">Kisan Call Centre (toll-free)</span>
          <span className="block text-green-800 font-semibold">1800-180-1551</span>
        </span>
      </a>

      <div className="bg-white rounded-2xl border border-green-100 p-4 flex flex-col gap-3">
        <p className="font-semibold text-[#0B3B24] flex items-center gap-2"><Headset size={18} /> Request a call-back</p>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your 10-digit phone number" className="rounded-xl border border-green-200 px-4 py-2.5 outline-none" />
        <textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={3} placeholder="Briefly describe what you need help with" className="rounded-xl border border-green-200 px-4 py-2.5 outline-none" />
        <button onClick={requestCall} disabled={loading || !phone || !issue} className="bg-[#0B3B24] text-white font-semibold rounded-full py-3 disabled:opacity-50">
          {loading ? 'Sending…' : 'Request call-back'}
        </button>
        {result?.grievanceCode && (
          <p className="text-sm text-green-800">
            Request received. Your reference number is <strong>{result.grievanceCode}</strong>. An officer will contact you.
          </p>
        )}
        {result?.error && <p className="text-sm text-red-600">{result.error}</p>}
      </div>
    </main>
  );
}
