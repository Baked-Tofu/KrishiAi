'use client';

import { useState, useEffect } from 'react';

export default function PricesPage() {
  const [state, setState] = useState('Telangana');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  async function fetchPrices() {
    setLoading(true);
    try {
      const res = await fetch(`/api/prices?state=${encodeURIComponent(state)}`);
      const data = await res.json();
      setPrices(data.prices || []);
      setUpdatedAt(data.updatedAt);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-md mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Today&apos;s Mandi Prices</h1>

      <select value={state} onChange={(e) => setState(e.target.value)} className="border rounded px-3 py-2">
        <option>Telangana</option>
        <option>Andhra Pradesh</option>
        <option>Maharashtra</option>
        <option>Karnataka</option>
      </select>

      <button
        onClick={fetchPrices}
        className="bg-green-600 text-white rounded-lg py-2 font-semibold"
      >
        Refresh Prices
      </button>

      {updatedAt && (
        <p className="text-xs text-gray-400">Last updated: {new Date(updatedAt).toLocaleString()}</p>
      )}

      {loading && <p className="text-gray-500 text-center">Loading...</p>}

      <div className="flex flex-col gap-2">
        {prices.map((item) => (
          <div key={item.commodity} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.commodity}</p>
              <p className="text-xs text-gray-400">{item.market}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-700">₹{item.modalPrice}/quintal</p>
              <p className="text-xs text-gray-400">Range ₹{item.minPrice}-₹{item.maxPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
