import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEFAULT_ALLOCATION_CATEGORIES, 
  DEFAULT_WALLETS, 
  DEFAULT_SAVINGS_GOALS, 
  DEFAULT_RECURRING_BILLS 
} from '../utils/defaultCategories';
import { 
  getStoredData, 
  setStoredData, 
  STORAGE_KEYS, 
  addToPendingSyncQueue, 
  getPendingSyncQueue 
} from '../services/offlineStorage';
import { syncOfflineDataToSupabase } from '../services/syncEngine';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // 1. Core State
  const [baseSalary, setBaseSalaryState] = useState(() => 
    getStoredData(STORAGE_KEYS.SALARY, 10000000)
  );

  const [categories, setCategoriesState] = useState(() => 
    getStoredData(STORAGE_KEYS.CATEGORIES, DEFAULT_ALLOCATION_CATEGORIES)
  );

  const [transactions, setTransactions] = useState(() => 
    getStoredData(STORAGE_KEYS.TRANSACTIONS, [
      {
        id: 'tx_demo_1',
        type: 'expense',
        amount: 1200000,
        categoryId: 'cat_cicilan',
        categoryName: 'Cicilan & Utang',
        walletId: 'w_bca',
        walletName: 'Bank BCA',
        recipientMerchant: 'KPR BTN / Cicilan Rumah',
        notes: 'Bayar cicilan bulanan 80% dari alokasi',
        transactionDate: new Date().toISOString()
      },
      {
        id: 'tx_demo_2',
        type: 'expense',
        amount: 350000,
        categoryId: 'cat_kebutuhan',
        categoryName: 'Kebutuhan Pokok',
        walletId: 'w_mandiri',
        walletName: 'Bank Mandiri',
        recipientMerchant: 'Belanja Supermarket Indomaret',
        notes: 'Stok beras dan bahan dapur',
        transactionDate: new Date().toISOString()
      },
      {
        id: 'tx_demo_3',
        type: 'expense',
        amount: 9900,
        categoryId: 'cat_reward',
        categoryName: 'Self Reward & Hiburan',
        walletId: 'w_bca',
        walletName: 'Bank BCA',
        recipientMerchant: 'JUMP START COFFEE 1 - QRI',
        notes: 'Pembelian kopi via QRIS myBCA',
        transactionDate: new Date().toISOString()
      }
    ])
  );

  const [wallets, setWallets] = useState(() => 
    getStoredData(STORAGE_KEYS.WALLETS, DEFAULT_WALLETS)
  );

  const [savingsGoals, setSavingsGoals] = useState(() => 
    getStoredData(STORAGE_KEYS.SAVINGS_GOALS, DEFAULT_SAVINGS_GOALS)
  );

  const [recurringBills, setRecurringBills] = useState(() => 
    getStoredData(STORAGE_KEYS.RECURRING_BILLS, DEFAULT_RECURRING_BILLS)
  );

  // 2. Network & Sync State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(getPendingSyncQueue().length);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline_pending'

  // Sync listener for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleTriggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline_pending');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTriggerSync = async () => {
    setSyncStatus('syncing');
    const res = await syncOfflineDataToSupabase();
    if (res.success) {
      setSyncStatus('synced');
      setPendingCount(0);
    } else {
      setSyncStatus('offline_pending');
    }
  };

  // 3. Mutators
  const setBaseSalary = (amount) => {
    const val = Number(amount) || 0;
    setBaseSalaryState(val);
    setStoredData(STORAGE_KEYS.SALARY, val);
    addToPendingSyncQueue({ entity: 'salary_allocations', action: 'UPDATE_SALARY', data: { base_salary: val } });
    setPendingCount(getPendingSyncQueue().length);
  };

  const updateCategories = (newCategories) => {
    setCategoriesState(newCategories);
    setStoredData(STORAGE_KEYS.CATEGORIES, newCategories);
    addToPendingSyncQueue({ entity: 'salary_allocations', action: 'UPDATE_CATEGORIES', data: { categories: newCategories } });
    setPendingCount(getPendingSyncQueue().length);
  };

  const addTransaction = (newTx) => {
    const txObj = {
      ...newTx,
      id: newTx.id || `tx_${Date.now()}`,
      transactionDate: newTx.transactionDate || new Date().toISOString()
    };

    const updated = [txObj, ...transactions];
    setTransactions(updated);
    setStoredData(STORAGE_KEYS.TRANSACTIONS, updated);

    // Update wallet balance if specified
    if (txObj.walletId) {
      setWallets((prev) => 
        prev.map((w) => {
          if (w.id === txObj.walletId) {
            const diff = txObj.type === 'income' ? txObj.amount : -txObj.amount;
            return { ...w, balance: Math.max(0, w.balance + diff) };
          }
          return w;
        })
      );
    }

    addToPendingSyncQueue({ entity: 'transactions', action: 'ADD_TRANSACTION', data: txObj });
    setPendingCount(getPendingSyncQueue().length);
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    setStoredData(STORAGE_KEYS.TRANSACTIONS, updated);
  };

  // 4. Computed Financial Analytics
  const extraIncomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalIncome = baseSalary + extraIncomeTotal;

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Compute breakdown per category
  const categoryStats = categories.map((cat) => {
    const allocatedAmount = Math.round((totalIncome * (cat.percentage / 100)));
    const spentAmount = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const remainingAmount = allocatedAmount - spentAmount;
    const usagePercent = allocatedAmount > 0 ? Math.round((spentAmount / allocatedAmount) * 100) : 0;

    return {
      ...cat,
      allocatedAmount,
      spentAmount,
      remainingAmount,
      usagePercent
    };
  });

  const totalAllocated = categoryStats.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const overallRemainingCash = totalIncome - totalExpenses;

  // Total Percentage sum check
  const totalPercentage = categories.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);
  const isValidPercentageTotal = totalPercentage === 100;

  return (
    <FinanceContext.Provider
      value={{
        baseSalary,
        setBaseSalary,
        categories,
        updateCategories,
        transactions,
        addTransaction,
        deleteTransaction,
        wallets,
        savingsGoals,
        recurringBills,
        isOnline,
        syncStatus,
        pendingCount,
        handleTriggerSync,
        // Computed
        totalIncome,
        extraIncomeTotal,
        totalExpenses,
        totalAllocated,
        overallRemainingCash,
        categoryStats,
        totalPercentage,
        isValidPercentageTotal
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
