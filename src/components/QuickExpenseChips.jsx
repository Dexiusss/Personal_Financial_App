import React from 'react';
import { Coffee, Utensils, Bus, ShoppingBag, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

const QUICK_EXPENSE_PRESETS = [
  { name: 'Kopi / Minuman', amount: 18000, categoryId: 'cat_reward', icon: Coffee, color: '#ec4899' },
  { name: 'Makan Siang / Malam', amount: 35000, categoryId: 'cat_kebutuhan', icon: Utensils, color: '#10b981' },
  { name: 'Transport / Ojek', amount: 25000, categoryId: 'cat_kebutuhan', icon: Bus, color: '#3b82f6' },
  { name: 'Belanja Toko', amount: 50000, categoryId: 'cat_kebutuhan', icon: ShoppingBag, color: '#8b5cf6' },
  { name: 'Pulsa / Paket Data', amount: 100000, categoryId: 'cat_kebutuhan', icon: Zap, color: '#f59e0b' }
];

export const QuickExpenseChips = () => {
  const { addTransaction, categories, wallets } = useFinance();

  const handleQuickAdd = (preset, e) => {
    const matchedCat = categories.find((c) => c.id === preset.categoryId) || categories[0];
    const matchedWallet = wallets[0];

    // Trigger canvas-confetti micro-interaction
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#f43f5e', '#3b82f6']
    });

    addTransaction({
      type: 'expense',
      amount: preset.amount,
      categoryId: matchedCat?.id,
      categoryName: matchedCat?.name || 'Kebutuhan',
      walletId: matchedWallet?.id,
      walletName: matchedWallet?.name || 'Bank BCA',
      recipientMerchant: preset.name,
      notes: `Pengeluaran cepat 1-klik`,
      transactionDate: new Date().toISOString()
    });
  };

  return (
    <div className="modern-glass-card rounded-[32px] p-5 mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Catat Cepat 1-Klik
        </div>
        <span className="text-[11px] text-slate-400 font-semibold">Pengeluaran Rutin</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
        {QUICK_EXPENSE_PRESETS.map((preset, idx) => {
          const IconComp = preset.icon;

          return (
            <button
              key={idx}
              onClick={(e) => handleQuickAdd(preset, e)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#161b22]/90 hover:bg-[#21262d] border border-white/10 transition-all flex-shrink-0 group hover:scale-[1.02] active:scale-95 shadow-lg"
            >
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-md font-bold"
                style={{ backgroundColor: preset.color }}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                  + {preset.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-black block">
                  {formatRupiah(preset.amount)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
