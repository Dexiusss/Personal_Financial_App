// Local Storage & Offline-First Persistence Layer

const STORAGE_KEYS = {
  SALARY: 'keuanganku_base_salary',
  CATEGORIES: 'keuanganku_categories',
  TRANSACTIONS: 'keuanganku_transactions',
  WALLETS: 'keuanganku_wallets',
  SAVINGS_GOALS: 'keuanganku_savings_goals',
  RECURRING_BILLS: 'keuanganku_recurring_bills',
  SUPABASE_CONFIG: 'keuanganku_supabase_config',
  PENDING_QUEUE: 'keuanganku_pending_sync_queue'
};

export const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage`, err);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to LocalStorage`, err);
  }
};

export const getPendingSyncQueue = () => {
  return getStoredData(STORAGE_KEYS.PENDING_QUEUE, []);
};

export const addToPendingSyncQueue = (mutation) => {
  const currentQueue = getPendingSyncQueue();
  const newQueue = [...currentQueue, { ...mutation, timestamp: Date.now() }];
  setStoredData(STORAGE_KEYS.PENDING_QUEUE, newQueue);
  return newQueue;
};

export const clearPendingSyncQueue = () => {
  setStoredData(STORAGE_KEYS.PENDING_QUEUE, []);
};

export { STORAGE_KEYS };
