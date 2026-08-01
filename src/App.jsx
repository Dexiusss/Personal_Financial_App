import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { HomeEconomicOverview } from './components/HomeEconomicOverview';
import { SummaryStats } from './components/SummaryStats';
import { SalaryAllocationCard } from './components/SalaryAllocationCard';
import { BudgetProgressCards } from './components/BudgetProgressCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { MultiWalletCard } from './components/MultiWalletCard';
import { SavingsGoalsCard } from './components/SavingsGoalsCard';
import { RecurringBillsCard } from './components/RecurringBillsCard';
import { SettingsScreen } from './components/SettingsScreen';
import { SmartEmailParserModal } from './components/SmartEmailParserModal';
import { TransactionFormModal } from './components/TransactionFormModal';
import { PieChart, BarChart3, CreditCard, SlidersHorizontal, Settings } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'analytics' | 'wallets' | 'allocation' | 'settings'
  
  // Modals
  const [isEmailParserOpen, setIsEmailParserOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState('');

  const handleOpenAddForCategory = (catId) => {
    setInitialCategoryId(catId);
    setIsAddTransactionOpen(true);
  };

  return (
    <div className="mobile-app-frame mx-auto relative flex flex-col h-screen sm:h-[880px] overflow-hidden selection:bg-[#8ee4af] selection:text-slate-950">
      
      {/* 1. Fixed Top Header */}
      <Navbar />

      {/* 2. Main Content Area (Zero-Scroll for Home, Scrollable for detailed tabs) */}
      <div className="flex-1 overflow-hidden px-5 pt-3 pb-24 flex flex-col justify-between">
        
        {/* HOMEBASE 1: Economic Overview & Donut Spending (Zero Scroll!) */}
        {activeTab === 'home' && (
          <div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            <HomeEconomicOverview 
              onOpenAddTransaction={() => {
                setInitialCategoryId('');
                setIsAddTransactionOpen(true);
              }}
              onViewAllTransactions={() => setActiveTab('settings')}
            />
          </div>
        )}

        {/* HOMEBASE 2: Weekly Trends & Financial Health Analytics */}
        {activeTab === 'analytics' && (
          <div className="h-full overflow-y-auto pr-1 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <SummaryStats />
            <AnalyticsCharts />
          </div>
        )}

        {/* HOMEBASE 3: Multi-Wallets, Cards & Savings Goals */}
        {activeTab === 'wallets' && (
          <div className="h-full overflow-y-auto pr-1 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <MultiWalletCard />
            <SavingsGoalsCard />
            <RecurringBillsCard />
          </div>
        )}

        {/* HOMEBASE 4: 100% Salary Percentage Allocation Customizer */}
        {activeTab === 'allocation' && (
          <div className="h-full overflow-y-auto pr-1 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <SalaryAllocationCard />
            <BudgetProgressCards onOpenAddTransactionForCategory={handleOpenAddForCategory} />
          </div>
        )}

        {/* HOMEBASE 5: Settings, Offline Supabase Sync & Transactions */}
        {activeTab === 'settings' && (
          <div className="h-full overflow-y-auto pr-1 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <SettingsScreen onOpenEmailParser={() => setIsEmailParserOpen(true)} />
            <TransactionList />
          </div>
        )}

      </div>

      {/* 3. PERMANENTLY PINNED HIGH-CONTRAST NAVBAR (Matching Screenshot Pill Style) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[#090c10]/95 backdrop-blur-2xl border-t border-white/10 py-3 px-4 flex items-center justify-around shadow-2xl">
        
        {/* 1. Donut Overview */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-extrabold shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Economic Overview"
        >
          <PieChart className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs font-bold hidden sm:inline">Overview</span>
        </button>

        {/* 2. Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-extrabold shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Analytics"
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs font-bold hidden sm:inline">Analytics</span>
        </button>

        {/* 3. Wallets */}
        <button
          onClick={() => setActiveTab('wallets')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all ${
            activeTab === 'wallets'
              ? 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-extrabold shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Dompet"
        >
          <CreditCard className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs font-bold hidden sm:inline">Dompet</span>
        </button>

        {/* 4. 100% Salary Allocation */}
        <button
          onClick={() => setActiveTab('allocation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all ${
            activeTab === 'allocation'
              ? 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-extrabold shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Alokasi Gaji 100%"
        >
          <SlidersHorizontal className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs font-bold hidden sm:inline">Alokasi</span>
        </button>

        {/* 5. Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-extrabold shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
          <span className="text-xs font-bold hidden sm:inline">Settings</span>
        </button>

      </div>

      {/* Modals */}
      <SmartEmailParserModal
        isOpen={isEmailParserOpen}
        onClose={() => setIsEmailParserOpen(false)}
      />

      <TransactionFormModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        initialCategoryId={initialCategoryId}
      />

    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
