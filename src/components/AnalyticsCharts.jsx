import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as ChartIcon, Activity } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const AnalyticsCharts = () => {
  const { categoryStats, totalExpenses, totalIncome } = useFinance();

  // Data for Recharts Pie Chart
  const pieData = categoryStats.map((c) => ({
    name: c.name,
    value: c.spentAmount,
    color: c.color
  })).filter((c) => c.value > 0);

  // Financial Health Score calculation
  const savingsCategory = categoryStats.find((c) => c.id === 'cat_tabungan');
  const savingsSpentRatio = savingsCategory ? (savingsCategory.spentAmount / (savingsCategory.allocatedAmount || 1)) : 0;
  const overallSpentRatio = totalExpenses / (totalIncome || 1);

  let healthScore = 90;
  if (overallSpentRatio > 0.8) healthScore -= 20;
  if (overallSpentRatio > 1.0) healthScore -= 40;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 1. Pie Chart - Distribution of Expenses */}
      <div className="lg:col-span-2 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-emerald-400" /> Analisis Proporsi Pengeluaran
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Persentase realisasi pengeluaran berdasarkan alokasi kantong.</p>
          </div>
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-xl">
            Total: {formatRupiah(totalExpenses)}
          </span>
        </div>

        {pieData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/50">
            Belum ada data pengeluaran untuk ditampilkan di grafik.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatRupiah(value), 'Pengeluaran']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2. Financial Health Score Card */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4" /> Financial Health Score
          </div>
          <h3 className="font-bold text-white text-lg">Kesehatan Keuangan</h3>
          <p className="text-xs text-slate-400 mt-1">Indikator rasio batas pengeluaran dibanding total alokasi gaji 100%.</p>
        </div>

        <div className="my-6 text-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-white">{healthScore}</span>
            </div>
          </div>
          <p className={`text-xs font-bold mt-3 ${healthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {healthScore >= 80 ? 'Kondisi Keuangan Sehat & Teratur 👌' : 'Perlu Penghematan Kebutuhan ⚠️'}
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span>Rasio Pengeluaran:</span>
            <strong className="text-white">{Math.round(overallSpentRatio * 100)}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Disiplin Alokasi:</span>
            <strong className="text-emerald-400">100% Valid</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
