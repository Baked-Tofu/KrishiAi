'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';

export default function RemindersPage() {
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState(null);
  const [message, setMessage] = useState('');

  async function load() {
    setMessage('');
    const res = await fetch(`/api/reminders?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setItems(data.reminders || []);
    if (data.error) setMessage(data.error);
  }

  async function add() {
    setMessage('');
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, note, date }),
    });
    const data = await res.json();
    if (data.error) {
      setMessage(data.error);
      return;
    }
    setNote('');
    setDate('');
    setMessage('Reminder saved.');
    load();
  }

  return (
    <main className="p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B3B24]">Reminders</h1>
        <p className="text-sm text-[#0B3B24]/70 mt-1">Keep track of deadlines and meetings. Scanned notices with a deadline can be saved here too.</p>
      </div>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Your 10-digit phone number"
        className="rounded-full border border-green-200 bg-white px-5 py-3 outline-none focus:border-green-600"
      />

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-3">
        <p className="font-semibold text-[#0B3B24] flex items-center gap-2"><CalendarDays size={18} /> Add a reminder</p>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What is it for? e.g. Pay society dues" className="rounded-xl border border-green-200 bg-white px-4 py-2.5 outline-none" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-green-200 bg-white px-4 py-2.5 outline-none" />
        <button onClick={add} disabled={!phone || !note || !date} className="bg-[#0B3B24] text-white font-semibold rounded-full py-3 disabled:opacity-50">
          Save reminder
        </button>
      </div>

      <button onClick={load} disabled={!phone} className="text-sm font-semibold text-green-800 underline disabled:opacity-50">
        Show my reminders
      </button>

      {message && <p className="text-sm text-[#0B3B24]">{message}</p>}

      {items && items.length === 0 && <p className="text-sm text-[#0B3B24]/60">No reminders yet for this number.</p>}
      {items && items.map((r) => (
        <div key={r.id} className="bg-white rounded-xl border border-green-100 p-3 flex justify-between gap-3">
          <p className="text-[#0B3B24]">{r.document_summary}</p>
          <p className="font-semibold text-green-800 shrink-0">{r.deadline_date}</p>
        </div>
      ))}
    </main>
  );
}
