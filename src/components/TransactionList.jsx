import React, { useState } from 'react';
import { Search, Download, Trash2, ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, CreditCard, Music, Zap } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah, formatTanggal } from '../utils/formatters';

const ICON_PASTELS = [
  { bg: 'bg-[#ffaaa5]/20', text: 'text-[#ffaaa5]', icon: Coffee },
  { bg: 'bg-[#8ee4af]/20', text: 'text-[#8ee4af]', icon: ShoppingBag },
  { bg: 'bg-[#fbe7c6]/20', text: 'text-[#fbe7c6]', icon: CreditCard },
  { bg: 'bg-[#90cdf4]/20', text: 'text-[#90cdf4]', icon: Music }
];

export const TransactionList = () => {
  const { transactions, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month'

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      (t.recipientMerchant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    const txDate = new Date(t.transactionDate);
    const now = new Date();

    if (dateFilter === 'today') {
      matchesDate = txDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = txDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesDate;
  });

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Tanggal', 'Tipe', 'Nominal', 'Kategori', 'Dompet', 'Penerima/Merchant', 'Catatan'];
    const rows = transactions.map((t) => [
      `"${formatTanggal(t.transactionDate)}"`,
      `"${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}"`,
      t.amount,
      `"${t.categoryName || ''}"`,
      `"${t.walletName || ''}"`,
      `"${t.recipientMerchant || ''}"`,
      `"${t.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 mb-6">
      
      {/* Header & Export */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-white text-lg tracking-tight">Transactions</h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2229] hover:bg-[#282d36] text-slate-300 text-xs font-bold border border-white/5 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#8ee4af]" /> CSV
        </button>
      </div>

      {/* Date Filter Quick Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'today', label: 'Hari Ini' },
          { key: 'week', label: '7 Hari' },
          { key: 'month', label: 'Bulan Ini' }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setDateFilter(btn.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              dateFilter === btn.key
                ? 'bg-[#8ee4af] text-slate-950 shadow-md'
                : 'bg-[#16191f] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#16191f] border border-white/5 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#8ee4af]"
        />
      </div>

      {/* Transactions List (Screen 3 Layout) */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-medium dark-card rounded-[24px]">
            Belum ada transaksi.
          </div>
        ) : (
          filteredTransactions.map((tx, idx) => {
            const styleObj = ICON_PASTELS[idx % ICON_PASTELS.length];
            const IconComponent = styleObj.icon;

            return (
              <div
                key={tx.id}
                className="dark-card p-4 rounded-[24px] flex items-center justify-between gap-3 hover:bg-[#1a1e24] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-full ${styleObj.bg} ${styleObj.text} flex items-center justify-center flex-shrink-0 font-bold`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{tx.recipientMerchant || 'Transaksi'}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {formatTanggal(tx.transactionDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Delete */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-extrabold ${
                    tx.type === 'income' ? 'text-[#8ee4af]' : 'text-[#ffaaa5]'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 text-slate-600 hover:text-[#ffaaa5] opacity-0 group-hover:opacity-100 transition-all"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
