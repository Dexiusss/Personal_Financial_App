import { initSupabaseClient } from './supabaseClient';
import { getPendingSyncQueue, clearPendingSyncQueue } from './offlineStorage';

export const syncOfflineDataToSupabase = async () => {
  const supabase = initSupabaseClient();
  if (!supabase) {
    return { success: false, reason: 'Supabase client not configured' };
  }

  if (!navigator.onLine) {
    return { success: false, reason: 'Perangkat sedang offline' };
  }

  const queue = getPendingSyncQueue();
  if (queue.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    let syncedCount = 0;
    for (const item of queue) {
      if (item.entity === 'transactions') {
        const { error } = await supabase.from('transactions').upsert(item.data);
        if (!error) syncedCount++;
      } else if (item.entity === 'salary_allocations') {
        const { error } = await supabase.from('salary_allocations').upsert(item.data);
        if (!error) syncedCount++;
      }
    }

    clearPendingSyncQueue();
    return { success: true, count: syncedCount };
  } catch (err) {
    console.error('Error executing sync engine:', err);
    return { success: false, reason: err.message };
  }
};
