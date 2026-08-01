import React from 'react';
import { Wallet } from 'lucide-react';

export const Navbar = () => {
  return (
    <div className="px-5 pt-6 pb-4 flex items-center justify-between bg-[#090c10]/95 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
      
      {/* Clean Front Header (System buttons moved to Settings) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-base tracking-tight">Keuangan<span className="text-emerald-400">Ku</span></span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">PRO</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Smart Financial Manager</span>
        </div>
      </div>

    </div>
  );
};
