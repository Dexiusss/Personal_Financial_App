import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const RecurringBillsCard = () => {
  const { recurringBills } = useFinance();

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Tagihan Rutin & Langganan Bulanan</h2>
          <p className="text-xs text-slate-400 mt-0.5">Pengingat tagihan tetap bulanan (KPR, Wi-Fi, Listrik, Netflix).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringBills.map((rb) => (
          <div
            key={rb.id}
            className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-white text-sm">{rb.title}</h4>
              <span className="text-xs text-slate-400 block mt-0.5">Jatuh Tempo: Tgl {rb.dueDay} Setiap Bulan</span>
              <span className="text-sm font-extrabold text-rose-400 block mt-1">{formatRupiah(rb.amount)}</span>
            </div>

            <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 ${
              rb.isPaid
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {rb.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {rb.isPaid ? 'Sudah Dibayar' : 'Belum Dibayar'}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
