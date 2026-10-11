'use client';

import { useState, useRef } from 'react';

export default function DocumentsPage() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | scanning | done
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    analyzeDocument(file);
  }

  async function analyzeDocument(file) {
    setStatus('scanning');
    setResult(null);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Could not analyze the document. Please try again.' });
    } finally {
      setStatus('done');
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setStatus('idle');
  }

  return (
    <main className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Document Explainer</h1>
      <p className="text-gray-500 text-sm">
        Take a photo of a notice, form, or bill. We&apos;ll read it and explain
        it in simple language.
      </p>

      {!image && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="bg-green-600 text-white rounded-lg py-4 font-semibold shadow"
          >
            📷 Take Photo
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border text-gray-600 rounded-lg py-3 text-sm"
          >
            Or choose from gallery
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}

      {image && (
        <div className="flex flex-col gap-4">
          <img src={image} alt="Captured document" className="rounded-lg border max-h-64 object-contain" />

          {status === 'scanning' && (
            <p className="text-center text-gray-500 animate-pulse">Reading document...</p>
          )}

          {status === 'done' && result && !result.error && (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-400">Document type</p>
                <p className="font-semibold">{result.documentType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Summary</p>
                <p>{result.summary}</p>
              </div>
              {result.deadline && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <p className="text-xs text-amber-700 font-semibold">Deadline detected</p>
                  <p className="text-amber-900">{result.deadline}</p>
                  <button className="text-xs underline text-amber-700 mt-1">
                    Confirm and set reminder
                  </button>
                </div>
              )}
            </div>
          )}

          {status === 'done' && result?.error && (
            <p className="text-red-600 text-sm">{result.error}</p>
          )}

          <button onClick={reset} className="text-sm text-gray-500 underline">
            Scan another document
          </button>
        </div>
      )}
    </main>
  );
}
