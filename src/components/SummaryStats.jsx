import React, { useState } from 'react';
import { TrendingUp, Edit2, Check, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const SummaryStats = () => {
  const { 
    baseSalary, 
    setBaseSalary, 
    totalIncome, 
    extraIncomeTotal, 
    totalExpenses, 
    overallRemainingCash 
  } = useFinance();

  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState(baseSalary.toString());

  const handleSaveSalary = () => {
    setBaseSalary(Number(salaryInput) || 0);
    setIsEditingSalary(false);
  };

  // Weekly bar data
  const days = [
    { day: 'Mon', height: '40%', active: false },
    { day: 'Tue', height: '65%', active: false },
    { day: 'Wed', height: '85%', active: true, amount: formatRupiah(1200000) },
    { day: 'Thu', height: '50%', active: false },
    { day: 'Fri', height: '70%', active: false },
    { day: 'Sat', height: '45%', active: false },
    { day: 'Sun', height: '30%', active: false }
  ];

  return (
    <div className="space-y-4 mb-6">
      
      {/* 1. Mint Green Featured Balance Card (Screen 1 & 3 Aesthetic) */}
      <div className="mint-card p-6 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[170px]">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-emerald-950/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-950/10 text-xs font-bold text-emerald-950">
            <span>% Gaji Utama</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-300">
            <ArrowUpRight className="w-3 h-3" /> +23%
          </div>
        </div>

        {/* Amount & Edit */}
        <div>
          <span className="text-xs font-semibold text-emerald-950/70 uppercase tracking-wider block">
            Total Dana / Sisa Bersih
          </span>
          {isEditingSalary ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                className="w-full bg-emerald-950/20 border border-emerald-950/30 text-emerald-950 font-extrabold rounded-xl px-3 py-1 text-xl focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveSalary}
                className="p-2 bg-emerald-950 text-white rounded-xl"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline justify-between mt-0.5">
              <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                {formatRupiah(overallRemainingCash)}
              </h1>
              <button
                onClick={() => {
                  setSalaryInput(baseSalary.toString());
                  setIsEditingSalary(true);
                }}
                className="p-1.5 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-950 transition-all"
                title="Ubah Gaji"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Decorative Wave Sparkline */}
        <div className="absolute right-4 bottom-3 opacity-30 pointer-events-none">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
            <path d="M0 30 Q 30 10, 60 25 T 120 5" stroke="#0a2518" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* 2. Dark Weekly Bar Chart Card */}
      <div className="dark-card p-5 rounded-[32px] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Pengeluaran 7 Hari Terakhir</span>
            <span className="text-2xl font-extrabold text-white tracking-tight mt-0.5 block">
              + {formatRupiah(totalExpenses)}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-semibold underline cursor-pointer">Lihat Semua</span>
        </div>

        {/* Bar Pillars */}
        <div className="pt-8 pb-2 flex items-end justify-between gap-2 h-36 px-2">
          {days.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group">
              {item.active && (
                <div className="absolute -top-7 bg-[#ffaaa5] text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap animate-bounce">
                  {item.amount}
                </div>
              )}
              <div className="w-full bg-[#1c2026] rounded-full h-full flex items-end overflow-hidden p-0.5">
                <div 
                  className={`w-full rounded-full transition-all duration-500 ${
                    item.active ? 'bg-[#ffaaa5]' : 'bg-[#8ee4af]/40 group-hover:bg-[#8ee4af]'
                  }`}
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
