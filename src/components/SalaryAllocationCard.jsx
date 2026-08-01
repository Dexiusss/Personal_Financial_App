import React, { useState } from 'react';
import { Sliders, AlertTriangle, CheckCircle, Plus, Trash2, Wand2, Calculator, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRupiah } from '../utils/formatters';
import { PRESET_RULES } from '../utils/defaultCategories';

export const SalaryAllocationCard = () => {
  const { 
    baseSalary, 
    setBaseSalary, 
    categories, 
    updateCategories, 
    totalIncome 
  } = useFinance();

  const [tempCategories, setTempCategories] = useState(categories);
  const [simulatorSalary, setSimulatorSalary] = useState(totalIncome);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPercent, setNewCatPercent] = useState('10');
  const [newCatColor, setNewCatColor] = useState('#8b5cf6');
  const [showAddForm, setShowAddForm] = useState(false);

  // Total Percentage sum
  const currentTotalPercent = tempCategories.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);
  const isValid = currentTotalPercent === 100;
  const diffTo100 = 100 - currentTotalPercent;

  const handlePercentageChange = (id, newPercent) => {
    const val = Math.max(0, Math.min(100, Number(newPercent) || 0));
    setTempCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, percentage: val } : c))
    );
  };

  const handleAdjustStep = (id, step) => {
    setTempCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newVal = Math.max(0, Math.min(100, c.percentage + step));
          return { ...c, percentage: newVal };
        }
        return c;
      })
    );
  };

  // Auto-Balance to 100% in 1-Click
  const handleAutoBalance = () => {
    if (diffTo100 === 0 || tempCategories.length === 0) return;
    
    // Add remaining diff to the last category
    setTempCategories((prev) => {
      const copy = [...prev];
      const lastIndex = copy.length - 1;
      const newPercent = Math.max(0, copy[lastIndex].percentage + diffTo100);
      copy[lastIndex] = { ...copy[lastIndex], percentage: newPercent };
      return copy;
    });
  };

  const handleApplyPreset = (presetCategories) => {
    setTempCategories(presetCategories);
    updateCategories(presetCategories);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: `cat_custom_${Date.now()}`,
      name: newCatName.trim(),
      percentage: Number(newCatPercent) || 0,
      color: newCatColor,
      icon: 'Tag',
      description: 'Kategori Kustom'
    };

    const updated = [...tempCategories, newCat];
    setTempCategories(updated);
    setNewCatName('');
    setShowAddForm(false);
  };

  const handleRemoveCategory = (id) => {
    if (tempCategories.length <= 1) return;
    const updated = tempCategories.filter((c) => c.id !== id);
    setTempCategories(updated);
  };

  const handleSave = () => {
    if (!isValid) return;
    updateCategories(tempCategories);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" /> Manajemen Alokasi Keuangan (Persentase Gaji)
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Atur Pembagian Presentase Gaji (Total Harus 100%)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan tombol pengatur persentase atau terapkan template instan di bawah ini.
          </p>
        </div>

        {/* Validation Pill & Auto-Balance Button */}
        <div className="flex flex-wrap items-center gap-3">
          {!isValid && (
            <button
              onClick={handleAutoBalance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all"
              title="Otomatis paskan sisa persentase ke 100%"
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto-Pas 100% ({diffTo100 > 0 ? `+${diffTo100}%` : `${diffTo100}%`})
            </button>
          )}

          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold border ${
            isValid 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isValid ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            Total: {currentTotalPercent}% / 100%
          </div>

          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow-lg ${
              isValid
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            Simpan Alokasi
          </button>
        </div>
      </div>

      {/* Interactive Salary Simulator Slider */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Calculator className="w-4 h-4 text-blue-400" /> Simulasi Kalkulator Nominal Gaji
          </div>
          <span className="text-sm font-extrabold text-blue-400">
            {formatRupiah(simulatorSalary)}
          </span>
        </div>

        <input
          type="range"
          min="3000000"
          max="50000000"
          step="500000"
          value={simulatorSalary}
          onChange={(e) => setSimulatorSalary(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
          <span>Rp 3.000.000</span>
          <span>Rp 25.000.000</span>
          <span>Rp 50.000.000</span>
        </div>
      </div>

      {/* Preset Rules Switcher */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Pilih Template Aturan Cepat:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_RULES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.categories)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all hover:border-emerald-500/40"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Visual Allocation Bar */}
      <div>
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {tempCategories.map((cat) => (
            <div
              key={cat.id}
              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
              className="h-full transition-all duration-300 relative group"
              title={`${cat.name}: ${cat.percentage}% (${formatRupiah((simulatorSalary * cat.percentage) / 100)})`}
            />
          ))}
        </div>
      </div>

      {/* Categories Grid List with Quick + / - Step Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tempCategories.map((cat) => {
          const nominal = Math.round((simulatorSalary * cat.percentage) / 100);

          return (
            <div
              key={cat.id}
              className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-4 h-10 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                  <span className="text-xs font-extrabold text-emerald-400 block mt-0.5">
                    {formatRupiah(nominal)}
                  </span>
                </div>
              </div>

              {/* Percentage Adjusters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => handleAdjustStep(cat.id, -5)}
                    className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold"
                    title="-5%"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleAdjustStep(cat.id, -1)}
                    className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold"
                    title="-1%"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={cat.percentage}
                    onChange={(e) => handlePercentageChange(cat.id, e.target.value)}
                    className="w-10 bg-transparent text-center text-xs font-extrabold text-white focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                  <button
                    onClick={() => handleAdjustStep(cat.id, 1)}
                    className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold"
                    title="+1%"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleAdjustStep(cat.id, 5)}
                    className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold"
                    title="+5%"
                  >
                    +5
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveCategory(cat.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Category Form Toggle */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {showAddForm ? (
          <form onSubmit={handleAddCategory} className="w-full flex flex-wrap items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <input
              type="text"
              placeholder="Nama Kategori (misal: Investasi Kripto)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              required
            />
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5">
              <input
                type="number"
                value={newCatPercent}
                onChange={(e) => setNewCatPercent(e.target.value)}
                className="w-12 bg-transparent text-right text-xs font-bold text-white focus:outline-none"
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Batal
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Tambah Kategori Kustom Baru
          </button>
        )}
      </div>

    </div>
  );
};
