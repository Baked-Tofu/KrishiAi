'use client';

import { useState, useRef } from 'react';

const toxicityColors = {
  Red: 'bg-red-100 border-red-400 text-red-800',
  Yellow: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  Blue: 'bg-blue-100 border-blue-400 text-blue-800',
  Green: 'bg-green-100 border-green-400 text-green-800',
  Unknown: 'bg-gray-100 border-gray-300 text-gray-700',
};

export default function PesticidePage() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const cameraInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    setPhotoCount((c) => c + 1);
    analyzeLabel(file);
  }

  async function analyzeLabel(file) {
    setStatus('scanning');
    setResult(null);
    const formData = new FormData();
    formData.append('label', file);

    try {
      const res = await fetch('/api/pesticide', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Could not read the label. Please try again.' });
    } finally {
      setStatus('done');
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setStatus('idle');
    setPhotoCount(0);
  }

  return (
    <main className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Pesticide Label Decoder</h1>
      <p className="text-gray-500 text-sm">
        Photograph the front label of the bottle. For curved bottles, take 2-3
        photos rotating the bottle slightly each time.
      </p>

      {!image && (
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="bg-green-600 text-white rounded-lg py-4 font-semibold shadow"
        >
          📷 Take Photo of Label
        </button>
      )}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      {image && (
        <div className="flex flex-col gap-4">
          <img src={image} alt="Pesticide label" className="rounded-lg border max-h-64 object-contain" />

          {status === 'scanning' && (
            <p className="text-center text-gray-500 animate-pulse">Checking registration and toxicity data...</p>
          )}

          {status === 'done' && result && !result.error && (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
              <div className={`border rounded p-3 ${toxicityColors[result.toxicityClass] || toxicityColors.Unknown}`}>
                <p className="text-xs font-semibold">Toxicity Class</p>
                <p className="font-bold">{result.toxicityClass}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Registration status</p>
                <p className={result.registered ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {result.registered ? '✓ Registered product' : '⚠ Not found in registered products list'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Safe usage</p>
                <p>{result.usageInstructions}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Pre-harvest interval (PHI)</p>
                <p>{result.phi}</p>
              </div>

              <p className="text-xs text-gray-400 italic border-t pt-2">
                For crop-specific dosage advice, consult your local Krishi Vigyan Kendra or agriculture officer.
              </p>
            </div>
          )}

          {status === 'done' && result?.error && (
            <p className="text-red-600 text-sm">{result.error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="text-sm bg-gray-100 rounded px-3 py-2 flex-1"
            >
              Add another angle ({photoCount} taken)
            </button>
            <button onClick={reset} className="text-sm text-gray-500 underline px-3 py-2">
              Start over
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
