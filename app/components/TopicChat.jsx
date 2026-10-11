'use client';

import { useState, useEffect } from 'react';
import { Send, Volume2 } from 'lucide-react';
import { getSavedLang } from '@/lib/languages';

export default function TopicChat({ title, intro, topic, suggestions = [] }) {
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en-IN');

  useEffect(() => {
    setLang(getSavedLang());
    const onChange = () => setLang(getSavedLang());
    window.addEventListener('langchange', onChange);
    return () => window.removeEventListener('langchange', onChange);
  }, []);

  async function ask(q) {
    const question = (q ?? text).trim();
    if (!question) return;
    setText(question);
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, topic }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || 'No answer received.');
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function speak() {
    if (!answer) return;
    const u = new SpeechSynthesisUtterance(answer);
    u.lang = lang;
    window.speechSynthesis.speak(u);
  }

  return (
    <main className="p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B3B24]">{title}</h1>
        <p className="text-sm text-[#0B3B24]/70 mt-1">{intro}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="text-left text-sm bg-green-50 border border-green-200 text-green-900 rounded-full px-4 py-2 hover:bg-green-100 transition"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Ask your question…"
          className="flex-1 min-w-0 rounded-full border border-green-200 bg-white px-5 py-3 outline-none focus:border-green-600"
        />
        <button
          onClick={() => ask()}
          disabled={loading || !text.trim()}
          className="flex items-center gap-2 bg-[#0B3B24] text-white font-semibold rounded-full px-5 disabled:opacity-50"
        >
          <Send size={16} /> Ask
        </button>
      </div>

      {loading && <p className="text-sm text-[#0B3B24]/60">Thinking…</p>}

      {answer && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-green-800">Answer</p>
            <button onClick={speak} className="flex items-center gap-1 text-xs text-green-800 underline">
              <Volume2 size={14} /> Listen
            </button>
          </div>
          <p className="text-[#0B3B24] whitespace-pre-line">{answer}</p>
        </div>
      )}
    </main>
  );
}
