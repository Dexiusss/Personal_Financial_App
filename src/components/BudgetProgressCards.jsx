import React from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const BudgetProgressCards = ({ onOpenAddTransactionForCategory }) => {
  const { categoryStats, totalIncome } = useFinance();

  return (
    <div className="space-y-5 mb-6">
      
      {/* Donut Allocation Ring Widget (Screen 2 Aesthetic) */}
      <div className="dark-card p-6 rounded-[32px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-lg tracking-tight">Alokasi Anggaran Bulanan</h3>
            <span className="text-xs text-slate-400 font-semibold block mt-0.5">Aturan Presentase 100% Gaji</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1e2229] flex items-center justify-center text-slate-300">
            <span className="text-xs font-bold">100%</span>
          </div>
        </div>

        {/* Big Central Donut Ring Visual */}
        <div className="relative py-4 flex items-center justify-center">
          <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="38" stroke="#16191d" strokeWidth="12" fill="transparent" />
            
            {/* Slice 1: Mint Green (40%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#8ee4af"
              strokeWidth="12"
              strokeDasharray="238.76"
              strokeDashoffset="95.5"
              fill="transparent"
              strokeLinecap="round"
            />

            {/* Slice 2: Soft Pink (20%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#ffaaa5"
              strokeWidth="12"
              strokeDasharray="238.76"
              strokeDashoffset="191"
              fill="transparent"
              strokeLinecap="round"
            />

            {/* Slice 3: Warm Yellow (20%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#fbe7c6"
              strokeWidth="12"
              strokeDasharray="238.76"
              strokeDashoffset="143"
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>

          {/* Central Donut Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Alokasi</span>
            <span className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              {formatRupiah(totalIncome)}
            </span>
          </div>
        </div>

        {/* Legend Breakdown Bars */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
          {categoryStats.slice(0, 3).map((cat) => (
            <div key={cat.id} className="text-left">
              <span className="text-[11px] text-slate-400 font-semibold truncate block">{cat.name}</span>
              <span className="text-base font-extrabold text-white block mt-0.5">{cat.percentage}%</span>
              <div 
                className="h-1.5 w-full rounded-full mt-1.5"
                style={{ backgroundColor: cat.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Categories Detailed Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-white tracking-tight uppercase">Rincian Kantong Alokasi</span>
          <span className="text-xs text-slate-400 font-semibold">Sisa Saldo</span>
        </div>

        {categoryStats.map((cat) => {
          const isOverBudget = cat.usagePercent > 100;

          return (
            <div
              key={cat.id}
              className="dark-card p-4 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#1a1e24] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.percentage}%
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">Terpakai: {formatRupiah(cat.spentAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className={`text-sm font-extrabold block ${
                    cat.remainingAmount >= 0 ? 'text-[#8ee4af]' : 'text-[#ffaaa5]'
                  }`}>
                    {formatRupiah(cat.remainingAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block">{cat.usagePercent}% dipakai</span>
                </div>

                <button
                  onClick={() => onOpenAddTransactionForCategory(cat.id)}
                  className="w-8 h-8 rounded-xl bg-[#1e2229] hover:bg-[#282d36] text-white flex items-center justify-center border border-white/5 transition-all"
                  title="Tambah Transaksi"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
