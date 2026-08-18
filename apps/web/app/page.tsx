import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl border border-slate-700 bg-slate-900/60 p-8 rounded-xl shadow-lg backdrop-blur">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800 rounded-full">
          Bytebinders Tech Solution Company
        </span>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-3">
          ByteAgroX
        </h1>
        
        <p className="text-xl font-medium text-emerald-400 mb-6">
          Agricultural trade built on trust.
        </p>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Trusted digital marketplace, escrow, and settlement infrastructure for agricultural commerce. Initial market deployment: <span className="font-semibold text-white">Hadejia, Jigawa State, Nigeria</span>.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-800 pt-6">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block font-mono">Web Frontend</span>
            <span className="text-sm font-semibold text-emerald-400">Next.js App Router (Active)</span>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block font-mono">API Connection</span>
            <span className="text-sm font-semibold text-amber-400">NestJS REST API (:3001)</span>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block font-mono">Settlement Layer</span>
            <span className="text-sm font-semibold text-emerald-400">Stellar Testnet SDK</span>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block font-mono">Database</span>
            <span className="text-sm font-semibold text-amber-400">PostgreSQL + Drizzle ORM</span>
          </div>
        </div>
      </div>
    </main>
  );
}
