'use client';

import { useState } from 'react';

export default function GrievancePage() {
  const [mode, setMode] = useState('menu'); // menu | file | track
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('PMFBY / Crop Insurance');
  const [description, setDescription] = useState('');
  const [filedResult, setFiledResult] = useState(null);
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fileGrievance() {
    setLoading(true);
    try {
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, category, description }),
      });
      const data = await res.json();
      setFiledResult(data);
    } finally {
      setLoading(false);
    }
  }

  async function trackGrievance() {
    setLoading(true);
    setTrackResult(null);
    try {
      const res = await fetch(`/api/grievance?code=${encodeURIComponent(trackCode)}`);
      const data = await res.json();
      setTrackResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Grievance</h1>

      {mode === 'menu' && (
        <div className="flex flex-col gap-3">
          <button onClick={() => setMode('file')} className="bg-green-600 text-white rounded-lg py-4 font-semibold shadow">
            📋 File a New Grievance
          </button>
          <button onClick={() => setMode('track')} className="bg-white border rounded-lg py-4 font-semibold">
            🔍 Check Status
          </button>
        </div>
      )}

      {mode === 'file' && !filedResult && (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow p-4">
          <label className="text-sm text-gray-500">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit phone number"
            className="border rounded px-3 py-2"
          />

          <label className="text-sm text-gray-500">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-2">
            <option>PMFBY / Crop Insurance</option>
            <option>Cooperative Society Dispute</option>
            <option>Scheme / Subsidy Issue</option>
            <option>Other</option>
          </select>

          <label className="text-sm text-gray-500">Describe the issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border rounded px-3 py-2"
            placeholder="You can also use the mic on the home page to speak this"
          />

          <button
            onClick={fileGrievance}
            disabled={loading || !phone || !description}
            className="bg-green-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Grievance'}
          </button>
          <button onClick={() => setMode('menu')} className="text-sm text-gray-500 underline">
            Back
          </button>
        </div>
      )}

      {filedResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-2">
          <p className="text-sm text-gray-500">Your grievance number is</p>
          <p className="text-2xl font-bold text-green-800">{filedResult.grievanceCode}</p>
          <p className="text-sm text-gray-600">Please note this down. You will also receive it by SMS.</p>
          <button
            onClick={() => {
              setMode('menu');
              setFiledResult(null);
              setDescription('');
            }}
            className="text-sm text-green-700 underline mt-2"
          >
            Done
          </button>
        </div>
      )}

      {mode === 'track' && (
        <div className="flex flex-col gap-3 bg-white rounded-lg shadow p-4">
          <label className="text-sm text-gray-500">Enter your grievance number</label>
          <input
            value={trackCode}
            onChange={(e) => setTrackCode(e.target.value)}
            placeholder="e.g. GR1023"
            className="border rounded px-3 py-2"
          />
          <button
            onClick={trackGrievance}
            disabled={loading || !trackCode}
            className="bg-green-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>

          {trackResult && !trackResult.error && (
            <div className="bg-gray-50 rounded p-3 mt-2">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold capitalize">{trackResult.status?.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500 mt-2">Category</p>
              <p>{trackResult.category}</p>
            </div>
          )}
          {trackResult?.error && <p className="text-red-600 text-sm">{trackResult.error}</p>}

          <button onClick={() => setMode('menu')} className="text-sm text-gray-500 underline">
            Back
          </button>
        </div>
      )}
    </main>
  );
}
