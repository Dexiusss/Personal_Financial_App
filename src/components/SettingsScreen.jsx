import React from 'react';
import { Mail, Wifi, WifiOff, Database, RefreshCw, Download, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const SettingsScreen = ({ onOpenEmailParser }) => {
  const { isOnline, syncStatus, pendingCount, handleTriggerSync } = useFinance();

  return (
    <div className="space-y-6 mb-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Settings Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-0.5">
          <Sliders className="w-3.5 h-3.5" /> System & Utilities
        </div>
        <h1 className="font-extrabold text-white text-xl tracking-tight">Pengaturan & Alat</h1>
        <span className="text-xs font-semibold text-slate-400 block mt-0.5">Kelola koneksi database, import email & backup.</span>
      </div>

      {/* 1. Database & Sync Status Card */}
      <div className="modern-glass-card p-5 rounded-[28px] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Status Sinkronisasi Supabase</h4>
              <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                {isOnline ? 'Terhubung Supabase Cloud' : 'Perangkat Offline (Lokal)'}
              </span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black border ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        <button
          onClick={handleTriggerSync}
          className="w-full py-3 rounded-2xl bg-[#161b22] hover:bg-[#21262d] text-slate-200 font-extrabold text-xs border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          {syncStatus === 'syncing' ? 'Syncing...' : 'Paksa Sinkronisasi Supabase'}
        </button>
      </div>

      {/* 2. Smart Email Import Card */}
      <div className="modern-glass-card p-5 rounded-[28px] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Import Email Bank</h4>
            <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
              Live Gmail API & Notifikasi Transaksi Bank
            </span>
          </div>
        </div>

        <button
          onClick={onOpenEmailParser}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" /> Buka Import Email Bank
        </button>
      </div>

      {/* 3. App Security & Info Card */}
      <div className="modern-glass-card p-5 rounded-[28px] space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> KeuanganKu PRO Private Edition
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Seluruh data alokasi gaji & transaksi Anda tersimpan aman secara offline-first dan tersinkronkan ke Supabase Cloud pribadi Anda.
        </p>
      </div>

    </div>
  );
};
