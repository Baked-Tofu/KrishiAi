'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mic, FileText, FlaskConical, FilePenLine, BarChart3, Headset, Volume2, Keyboard, Send } from 'lucide-react';
import { LANGS } from '@/lib/languages';
import { useT } from '@/lib/translations';

const tiles = [
  { href: '/documents', key: 'documents', icon: FileText, tint: 'bg-sky-100 text-sky-700' },
  { href: '/pesticide', key: 'label', icon: FlaskConical, tint: 'bg-indigo-100 text-indigo-700' },
  { href: '/grievance', key: 'complaint', icon: FilePenLine, tint: 'bg-orange-100 text-orange-600' },
  { href: '/prices', key: 'prices', icon: BarChart3, tint: 'bg-rose-100 text-rose-600' },
];

export default function Home() {
  const { lang, t } = useT();
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  function chooseLang(code) {
    try { localStorage.setItem('lang', code); } catch {}
    window.dispatchEvent(new Event('langchange'));
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true; // live captions while speaking
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setText(transcript);
      if (e.results[e.results.length - 1].isFinal) ask(transcript);
    };
    rec.start();
  }

  async function ask(question) {
    const q = (question || '').trim();
    if (!q) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lang }),
      });
      const data = await res.json();
      const reply = data.answer || data.error || '';
      setAnswer(reply);
      speak(reply);
    } catch {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function speak(msg) {
    if (!msg) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lang;
    window.speechSynthesis.speak(u);
  }

  return (
    <main className="max-w-xl mx-auto px-4 pt-5 pb-10 flex flex-col items-center gap-4">
      {/* Language buttons in their own script */}
      <div className="flex flex-wrap justify-center gap-2">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => chooseLang(l.code)}
            className={`rounded-full px-4 py-2 text-base font-bold shadow ${
              lang === l.code ? 'bg-[#0B3B24] text-white' : 'bg-white/80 text-[#0B3B24]'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Giant mic */}
      <button
        onClick={startListening}
        disabled={listening || loading}
        className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center shadow-2xl border-8 border-white/80 transition ${
          listening ? 'bg-green-500 animate-pulse' : 'bg-[#0B3B24] hover:bg-green-900'
        }`}
        aria-label={t('mic_tap')}
      >
        <Mic size={60} className="text-white" />
      </button>
      <p className="text-xl font-extrabold text-white drop-shadow text-center -mt-1">
        {listening ? t('listening') : loading ? t('thinking') : t('mic_tap')}
      </p>

      {/* Type bar - also shows live captions while speaking */}
      <div className="w-full flex items-center gap-2 bg-white/90 rounded-full shadow-lg pl-4 pr-2 py-2">
        <Keyboard size={22} className="text-[#0B3B24]/60 shrink-0" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask(text)}
          placeholder={t('type_here')}
          className="flex-1 min-w-0 bg-transparent outline-none text-lg py-1.5 text-[#0B3B24]"
        />
        <button
          onClick={() => ask(text)}
          disabled={loading || !text.trim()}
          className="w-11 h-11 shrink-0 rounded-full bg-[#0B3B24] text-white flex items-center justify-center disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Answer appears right under the type bar */}
      {answer && (
        <div className="w-full bg-white/90 rounded-3xl p-5 shadow-lg">
          <p className="text-xl text-[#0B3B24] leading-relaxed whitespace-pre-line">{answer}</p>
          <button
            onClick={() => speak(answer)}
            className="mt-3 flex items-center gap-2 bg-lime-200 rounded-full px-5 py-3 text-lg font-bold text-[#0B3B24]"
          >
            <Volume2 size={24} /> {t('listen')}
          </button>
        </div>
      )}

      {/* Four tiles in one row, with space between */}
      <div className="grid grid-cols-4 gap-3 sm:gap-5 w-full mt-1">
        {tiles.map(({ href, key, icon: Icon, tint }) => (
          <Link
            key={href}
            href={href}
            className="bg-white/85 backdrop-blur-md rounded-2xl px-1 py-3 sm:p-4 flex flex-col items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <span className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${tint}`}>
              <Icon size={28} />
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#0B3B24] text-center leading-tight break-words">
              {t(key)}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/officer"
        className="w-full flex items-center justify-center gap-3 bg-white/85 rounded-full py-3.5 text-lg font-extrabold text-[#0B3B24] shadow-lg"
      >
        <Headset size={26} /> {t('person')}
      </Link>
    </main>
  );
}