import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, Wallet, CreditCard, FileText } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';

export const TransactionFormModal = ({ isOpen, onClose, initialCategoryId }) => {
  const { categories, wallets, addTransaction } = useFinance();

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [recipientMerchant, setRecipientMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(initialCategoryId || categories[0].id);
    }
    if (wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [isOpen, initialCategoryId, categories, wallets]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    const matchedCat = categories.find((c) => c.id === categoryId);
    const matchedWallet = wallets.find((w) => w.id === walletId);

    addTransaction({
      type,
      amount: numAmount,
      categoryId,
      categoryName: matchedCat ? matchedCat.name : 'Umum',
      walletId,
      walletName: matchedWallet ? matchedWallet.name : 'Bank',
      recipientMerchant: recipientMerchant.trim() || (type === 'income' ? 'Pemasukan' : 'Pengeluaran'),
      notes: notes.trim(),
      transactionDate: new Date(transactionDate).toISOString()
    });

    onClose();
    setAmount('');
    setRecipientMerchant('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white tracking-tight mb-6">Tambah Transaksi Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              - Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              + Pemasukan Ekstra
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 text-sm font-bold">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-lg rounded-2xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Category Picker */}
          {type === 'expense' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Alokasi Presentase</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.percentage}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Wallet Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Rekening / Dompet</label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-3 text-xs focus:outline-none focus:border-emerald-500"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Saldo: {formatRupiah(w.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient / Merchant */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {type === 'expense' ? 'Penerima / Merchant / Toko' : 'Sumber Pemasukan (misal: Freelance)'}
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'misal: Indomaret, Cicilan BTN, Cafe' : 'misal: Bonus Proyek, Jual Barang'}
              value={recipientMerchant}
              onChange={(e) => setRecipientMerchant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Transaksi</label>
            <input
              type="datetime-local"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all mt-4"
          >
            Simpan Transaksi
          </button>

        </form>

      </div>
    </div>
  );
};
