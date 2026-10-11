'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function AppFrame({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      {/* Full-screen field photo */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/field-bg.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/10 via-transparent to-black/25" />

      <header className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 bg-white/70 backdrop-blur-md rounded-b-3xl px-5 py-3 shadow-sm border border-white/50">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Leaf className="text-green-700 shrink-0" size={34} strokeWidth={2.2} />
            <span className="flex flex-col leading-tight min-w-0">
              <span className="text-2xl font-extrabold text-[#0B3B24]">KrishiAi</span>
              <span className="text-xs text-[#0B3B24]/70 truncate">Your multilingual rural assistant</span>
            </span>
          </Link>

          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#0B3B24] bg-white/80 rounded-full px-4 py-2.5 shadow-sm shrink-0"
            >
              <ArrowLeft size={16} /> Home
            </Link>
          )}
        </div>
      </header>

      {isHome ? (
        children
      ) : (
        <div className="max-w-2xl mx-4 sm:mx-auto my-6 rounded-3xl bg-white/80 backdrop-blur-md shadow-lg border border-white/60">
          {children}
        </div>
      )}
    </>
  );
}