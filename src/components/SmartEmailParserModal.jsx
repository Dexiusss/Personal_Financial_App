import React, { useState } from 'react';
import { X, Mail, Sparkles, CheckCircle2, ArrowRight, RefreshCw, LogIn } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { parseBankEmailText, fetchGmailInboxNotifications } from '../services/emailParserService';
import { formatRupiah } from '../utils/formatters';

export const SmartEmailParserModal = ({ isOpen, onClose }) => {
  const { categories, wallets, addTransaction } = useFinance();

  const [activeSubTab, setActiveSubTab] = useState('paste'); // 'paste' | 'gmail'
  const [pasteText, setPasteText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [isFetchingGmail, setIsFetchingGmail] = useState(false);
  const [gmailMessages, setGmailMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleParseText = (textToParse) => {
    const raw = textToParse || pasteText;
    if (!raw.trim()) return;

    const result = parseBankEmailText(raw);
    if (result) {
      setParsedData(result);
      setSelectedCategoryId(result.suggestedCategoryId || categories[0]?.id || '');
      
      const matchedWallet = wallets.find((w) => 
        w.name.toLowerCase().includes(result.walletName.toLowerCase())
      );
      setSelectedWalletId(matchedWallet ? matchedWallet.id : wallets[0]?.id || '');
    }
  };

  const handleConnectGmailOAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google/url');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Redirects to Google Login Consent Screen
        }
      }
    } catch (err) {
      console.error('Error initiating Google OAuth:', err);
    }
  };

  const handleFetchGmail = async () => {
    setIsFetchingGmail(true);
    const msgs = await fetchGmailInboxNotifications();
    setGmailMessages(msgs);
    setIsFetchingGmail(false);
  };

  const handleSelectGmailMessage = (msg) => {
    setPasteText(msg.rawBody);
    handleParseText(msg.rawBody);
    setActiveSubTab('paste');
  };

  const handleConfirmAddTransaction = () => {
    if (!parsedData || parsedData.amount <= 0) return;

    const matchedCategory = categories.find((c) => c.id === selectedCategoryId);
    const matchedWallet = wallets.find((w) => w.id === selectedWalletId);

    addTransaction({
      type: 'expense',
      amount: parsedData.amount,
      categoryId: selectedCategoryId,
      categoryName: matchedCategory ? matchedCategory.name : 'Uncategorized',
      walletId: selectedWalletId,
      walletName: matchedWallet ? matchedWallet.name : 'Bank',
      recipientMerchant: parsedData.recipientOrMerchant,
      notes: `Import otomatis dari email ${parsedData.transactionType || ''}`,
      transactionDate: parsedData.transactionDate
    });

    setSuccessMessage(`Berhasil menambahkan pengeluaran ${formatRupiah(parsedData.amount)} untuk ${parsedData.recipientOrMerchant}!`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
      setParsedData(null);
      setPasteText('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Smart Email Expense Parser</h2>
            <p className="text-xs text-slate-400">Deteksi otomatis nominal & penerima transaksi dari email bank (myBCA, Mandiri, GoPay, dll.)</p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('paste')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'paste'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Teks Email
          </button>
          <button
            onClick={() => {
              setActiveSubTab('gmail');
              if (gmailMessages.length === 0) handleFetchGmail();
            }}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'gmail'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Integrasi Live Gmail API
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: Paste Email Text */}
        {activeSubTab === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tempelkan (Paste) Teks Email Notifikasi Bank:
              </label>
              <textarea
                rows="6"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Contoh myBCA / Mandiri:&#10;&#10;Transfer Berhasil&#10;Jumlah Transfer: Rp 700.000,00&#10;Penerima: EVADITUS KRESNA YUVI&#10;&#10;atau&#10;&#10;Transaction Type: QRIS Payment&#10;Payment to: JUMP START COFFEE&#10;Total Payment: IDR 9,900.00"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl p-4 text-xs font-mono focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              onClick={() => handleParseText()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Deteksi Otomatis Rincian Transaksi
            </button>
          </div>
        )}

        {/* TAB 2: Gmail API Live Inbox Reader */}
        {activeSubTab === 'gmail' && (
          <div className="space-y-4">
            
            {/* Google OAuth Connect Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-blue-400" /> Hubungkan Akun Gmail Anda
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bot akan otomatis membaca email masuk dari BCA, Mandiri, GoPay & memposting ke Supabase.
                </p>
              </div>

              <button
                onClick={handleConnectGmailOAuth}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 flex-shrink-0 transition-all"
              >
                Connect Gmail
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-300">Email Notifikasi Terdeteksi:</span>
              <button
                onClick={handleFetchGmail}
                disabled={isFetchingGmail}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGmail ? 'animate-spin' : ''}`} />
                {isFetchingGmail ? 'Pindai Inbox...' : 'Pindai Ulang'}
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {gmailMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectGmailMessage(msg)}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 block">{msg.sender}</span>
                    <h4 className="font-bold text-white text-xs mt-0.5">{msg.subject}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{msg.snippet}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parsed Result Box */}
        {parsedData && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Hasil Deteksi Otomatis:
              </h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Nominal Transaksi:</span>
                <span className="text-lg font-extrabold text-white">{formatRupiah(parsedData.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Penerima / Merchant:</span>
                <span className="text-xs font-bold text-slate-200">{parsedData.recipientOrMerchant}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Sumber Rekening / Dompet:</span>
                <span className="text-xs font-bold text-blue-400">{parsedData.walletName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Potong Dari Kantong Persentase Mana?
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pilih Dompet / Metode Bayar:
                </label>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleConfirmAddTransaction}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              Simpan Ke Catatan Transaksi
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
