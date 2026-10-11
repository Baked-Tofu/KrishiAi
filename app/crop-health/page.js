'use client';

import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

export default function CropHealthPage() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState('');
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);

    setStatus('scanning');
    setResult('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/crop-health', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data.answer || data.error || 'No result received.');
    } catch {
      setResult('Could not check the image. Please try again.');
    } finally {
      setStatus('done');
    }
  }

  return (
    <main className="p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B3B24]">Crop Health</h1>
        <p className="text-sm text-[#0B3B24]/70 mt-1">
          Photograph a leaf or plant that looks unhealthy. Hold the camera close and keep the leaf in focus.
        </p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 bg-[#0B3B24] text-white font-semibold rounded-full py-4"
      >
        <Camera size={20} /> Take Photo
      </button>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {image && <img src={image} alt="Crop" className="rounded-2xl border max-h-64 object-contain" />}
      {status === 'scanning' && <p className="text-center text-sm animate-pulse text-[#0B3B24]/60">Checking your crop…</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-green-800 mb-1">Possible issue</p>
          <p className="text-[#0B3B24] whitespace-pre-line">{result}</p>
          <p className="text-xs text-[#0B3B24]/60 mt-3 border-t pt-2">
            This is only a guide from a photo. Confirm with your local Krishi Vigyan Kendra or agriculture officer before treating.
          </p>
        </div>
      )}
    </main>
  );
}
