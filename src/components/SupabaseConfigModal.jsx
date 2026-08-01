import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../services/offlineStorage';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const config = getStoredData(STORAGE_KEYS.SUPABASE_CONFIG, null);
    if (config) {
      setUrl(config.url || '');
      setKey(config.key || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredData(STORAGE_KEYS.SUPABASE_CONFIG, { url: url.trim(), key: key.trim() });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Konfigurasi Database Supabase</h2>
            <p className="text-xs text-slate-400">Hubungkan aplikasi offline ini dengan backend Supabase Cloud Anda.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Konfigurasi Supabase berhasil disimpan!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL</label>
            <input
              type="url"
              placeholder="https://xyzproject.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Anon Key (API Key)</label>
            <input
              type="text"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Langkah Penyiapan Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px]">
              <li>Buat proyek gratis di <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a></li>
              <li>Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda.</li>
              <li>Jalankan script DDL dari file <code>supabase_schema.sql</code> yang telah disediakan di proyek ini.</li>
            </ol>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all mt-2"
          >
            Simpan Konfigurasi
          </button>
        </form>

      </div>
    </div>
  );
};
