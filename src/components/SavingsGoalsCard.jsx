import React from 'react';
import { Target, PiggyBank, Calendar } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, calculatePercentage } from '../utils/formatters';

export const SavingsGoalsCard = () => {
  const { savingsGoals } = useFinance();

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Target Tabungan & Goal Finansial</h2>
          <p className="text-xs text-slate-400 mt-0.5">Memantau progress pencapaian target tabungan impian Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savingsGoals.map((sg) => {
          const percent = calculatePercentage(sg.currentAmount, sg.targetAmount);

          return (
            <div
              key={sg.id}
              className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{sg.title}</h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Target: {sg.targetDate}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  {percent}%
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Terkumpul: <strong className="text-white">{formatRupiah(sg.currentAmount)}</strong></span>
                  <span className="text-slate-400">Target: <strong className="text-slate-200">{formatRupiah(sg.targetAmount)}</strong></span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
