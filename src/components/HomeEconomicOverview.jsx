import React from 'react';
import { LayoutGrid, ArrowRight, Coffee, Utensils, Bus, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatTanggal } from '../utils/formatters';

const CATEGORY_GRADIENTS = [
  { id: 'gradMint', start: '#10b981', stop: '#34d399', color: '#34d399' },
  { id: 'gradPink', start: '#f43f5e', stop: '#fb7185', color: '#fb7185' },
  { id: 'gradYellow', start: '#f59e0b', stop: '#fbbf24', color: '#fbbf24' }
];

export const HomeEconomicOverview = ({ onOpenAddTransaction, onViewAllTransactions }) => {
  const { categoryStats, totalExpenses, totalIncome, transactions, addTransaction, categories, wallets } = useFinance();

  const categoriesWithSpending = categoryStats.filter((c) => c.spentAmount > 0);
  const displayCategories = categoriesWithSpending.length > 0 ? categoriesWithSpending : categoryStats.slice(0, 3);

  // SVG Donut Slices Math
  const radius = 36;
  const circumference = 2 * Math.PI * radius; // ~226.19
  const totalRef = totalExpenses > 0 ? totalExpenses : 1;

  let currentOffset = 0;
  const donutSlices = displayCategories.map((cat, idx) => {
    const fraction = totalExpenses > 0 ? cat.spentAmount / totalRef : cat.percentage / 100;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += fraction * circumference;
    const sharePercent = totalExpenses > 0 ? Math.round(fraction * 100) : cat.percentage;
    const gradObj = CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];

    return {
      ...cat,
      fraction,
      strokeDasharray,
      strokeDashoffset,
      sharePercent,
      gradId: gradObj.id,
      color: gradObj.color
    };
  });

  const recentTx = transactions.slice(0, 2);

  const handleQuickAdd = (presetName, amount, catId, color) => {
    const matchedCat = categories.find((c) => c.id === catId) || categories[0];
    const matchedWallet = wallets[0];

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: [color, '#10b981', '#3b82f6']
    });

    addTransaction({
      type: 'expense',
      amount: amount,
      categoryId: matchedCat?.id,
      categoryName: matchedCat?.name || 'Kebutuhan',
      walletId: matchedWallet?.id,
      walletName: matchedWallet?.name || 'Bank BCA',
      recipientMerchant: presetName,
      notes: `Catat Cepat 1-Klik`,
      transactionDate: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      
      {/* 1. Economic Overview Main Compact Donut Card (Fits 100% Zero-Scroll) */}
      <div className="modern-glass-card p-5 rounded-[32px] space-y-4 relative overflow-hidden flex-1 flex flex-col justify-between">
        
        {/* Glow ambient background sphere */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="font-black text-white text-lg tracking-tight">Economic Overview</h1>
            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">Total Pengeluaran Bulan Ini</span>
          </div>
          <button 
            onClick={onOpenAddTransaction}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md active:scale-95 transition-all"
            title="Tambah Transaksi"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Central Compact Donut Circle Visual */}
        <div className="relative py-1 flex items-center justify-center">
          
          <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradMint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="gradPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="gradYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle cx="50" cy="50" r="36" stroke="#161b22" strokeWidth="11" fill="transparent" />

            {/* Dynamic Donut Slices */}
            {donutSlices.map((slice) => (
              <circle
                key={slice.id}
                cx="50"
                cy="50"
                r="36"
                stroke={`url(#${slice.gradId})`}
                strokeWidth="11"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                fill="transparent"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            ))}
          </svg>

          {/* Central Donut Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Spending</span>
            <span className="text-xl font-black text-white tracking-tight mt-0.5">
              {formatRupiah(totalExpenses)}
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Of Dana Masuk</span>
            <span className="text-xs font-black text-emerald-400 mt-0.5">
              {formatRupiah(totalIncome)}
            </span>
          </div>

          {/* Slice Callout Badges */}
          {donutSlices.slice(0, 3).map((slice, idx) => {
            const positions = [
              'top-1 right-2',
              'bottom-4 left-3',
              'right-1 top-1/2'
            ];

            return (
              <div
                key={slice.id}
                className={`absolute ${positions[idx % positions.length]} bg-[#161b22]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 shadow-lg text-[9px] font-black text-slate-100 flex items-center gap-1`}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slice.color }} />
                {formatRupiah(slice.spentAmount > 0 ? slice.spentAmount : slice.allocatedAmount)}
              </div>
            );
          })}
        </div>

        {/* Legend Breakdown Below Donut */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
          {donutSlices.slice(0, 3).map((slice) => (
            <div key={slice.id} className="text-left space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 truncate block">
                {slice.name}
              </span>
              <span className="text-base font-black text-white block leading-none">
                {slice.sharePercent}%
              </span>
              <div
                className="h-1 w-full rounded-full mt-1"
                style={{ backgroundColor: slice.color }}
              />
            </div>
          ))}
        </div>

      </div>

      {/* 2. Compact 1-Click Quick Expense Pills (Fits 100% Zero-Scroll) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleQuickAdd('Kopi / Minuman', 18000, 'cat_reward', '#ec4899')}
          className="p-2.5 rounded-2xl bg-[#161b22]/90 border border-white/10 text-left hover:bg-[#21262d] transition-all active:scale-95"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Coffee className="w-3.5 h-3.5 text-pink-400" /> Kopi
          </div>
          <span className="text-[10px] font-black text-emerald-400 block mt-0.5">
            + Rp 18rb
          </span>
        </button>

        <button
          onClick={() => handleQuickAdd('Makan Siang', 35000, 'cat_kebutuhan', '#10b981')}
          className="p-2.5 rounded-2xl bg-[#161b22]/90 border border-white/10 text-left hover:bg-[#21262d] transition-all active:scale-95"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Utensils className="w-3.5 h-3.5 text-emerald-400" /> Makan
          </div>
          <span className="text-[10px] font-black text-emerald-400 block mt-0.5">
            + Rp 35rb
          </span>
        </button>

        <button
          onClick={() => handleQuickAdd('Transport / Ojek', 25000, 'cat_kebutuhan', '#3b82f6')}
          className="p-2.5 rounded-2xl bg-[#161b22]/90 border border-white/10 text-left hover:bg-[#21262d] transition-all active:scale-95"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Bus className="w-3.5 h-3.5 text-blue-400" /> Transport
          </div>
          <span className="text-[10px] font-black text-emerald-400 block mt-0.5">
            + Rp 25rb
          </span>
        </button>
      </div>

    </div>
  );
};
