import React from 'react';
import { CreditCard, Wallet, Landmark, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const MultiWalletCard = () => {
  const { wallets } = useFinance();

  const totalWalletBalance = wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);

  return (
    <div className="space-y-4 mb-6">
      
      {/* User Card Widget & Action Tiles (Screen 3 Aesthetic) */}
      <div className="grid grid-cols-12 gap-3">
        
        {/* Main User Card Tile (8 cols) */}
        <div className="col-span-8 dark-card p-5 rounded-[28px] flex flex-col justify-between min-h-[160px] relative overflow-hidden bg-[#16191f]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white tracking-tight">Ricky Mario</span>
            <span className="text-[10px] text-slate-400 font-mono">**** 8536</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Balance Semua Dompet</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {formatRupiah(totalWalletBalance)}
              </h2>
            </div>
            <span className="text-[10px] text-[#8ee4af] font-bold block mt-1">+11,05% Minggu Ini</span>
          </div>
        </div>

        {/* Action Quick Tiles (4 cols) */}
        <div className="col-span-4 flex flex-col gap-2.5">
          <div className="flex-1 bg-[#8ee4af] p-3 rounded-[22px] flex items-center justify-center text-slate-950 font-bold shadow-md cursor-pointer hover:opacity-90 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <div className="flex-1 bg-[#fbe7c6] p-3 rounded-[22px] flex items-center justify-center text-slate-950 font-bold shadow-md cursor-pointer hover:opacity-90 transition-all">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Wallets List Grid */}
      <div className="space-y-2.5 pt-2">
        <span className="text-xs font-extrabold text-white uppercase tracking-wider block px-1">Daftar Rekening & Dompet</span>
        
        {wallets.map((w) => (
          <div
            key={w.id}
            className="dark-card p-4 rounded-[24px] flex items-center justify-between hover:bg-[#1a1e24] transition-all"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: w.color || '#3b82f6' }}
              >
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{w.name}</h4>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-0.5">{w.type}</span>
              </div>
            </div>

            <span className="text-sm font-extrabold text-white">{formatRupiah(w.balance)}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
