// Default Categories, Presets and Wallets for Finance Manager

export const DEFAULT_ALLOCATION_CATEGORIES = [
  {
    id: 'cat_kebutuhan',
    name: 'Kebutuhan Pokok',
    percentage: 40,
    color: '#3b82f6', // Blue
    icon: 'ShoppingCart',
    description: 'Makan, belanja bulanan, transportasi, listrik, air'
  },
  {
    id: 'cat_tabungan',
    name: 'Tabungan',
    percentage: 20,
    color: '#10b981', // Emerald
    icon: 'PiggyBank',
    description: 'Tabungan masa depan, investasi awal'
  },
  {
    id: 'cat_cicilan',
    name: 'Cicilan & Utang',
    percentage: 20,
    color: '#ef4444', // Red
    icon: 'CreditCard',
    description: 'KPR, cicilan motor/mobil, kartu kredit, pinjaman'
  },
  {
    id: 'cat_reward',
    name: 'Self Reward & Hiburan',
    percentage: 10,
    color: '#ec4899', // Pink
    icon: 'Gift',
    description: 'Jalan-jalan, nonton, jajan kopi, hobi'
  },
  {
    id: 'cat_darurat',
    name: 'Dana Darurat & Lainnya',
    percentage: 10,
    color: '#f59e0b', // Amber
    icon: 'ShieldAlert',
    description: 'Cadangan kesehatan, perbaikan tak terduga, sedekah'
  }
];

export const PRESET_RULES = [
  {
    name: 'Aturan 40-20-20-10-10 (Rekomendasi Seimbang)',
    categories: [
      { id: 'cat_kebutuhan', name: 'Kebutuhan Pokok', percentage: 40, color: '#3b82f6', icon: 'ShoppingCart' },
      { id: 'cat_tabungan', name: 'Tabungan', percentage: 20, color: '#10b981', icon: 'PiggyBank' },
      { id: 'cat_cicilan', name: 'Cicilan & Utang', percentage: 20, color: '#ef4444', icon: 'CreditCard' },
      { id: 'cat_reward', name: 'Self Reward & Hiburan', percentage: 10, color: '#ec4899', icon: 'Gift' },
      { id: 'cat_darurat', name: 'Dana Darurat & Lainnya', percentage: 10, color: '#f59e0b', icon: 'ShieldAlert' }
    ]
  },
  {
    name: 'Aturan 50-30-20 (Klasik)',
    categories: [
      { id: 'cat_kebutuhan', name: 'Kebutuhan Utama', percentage: 50, color: '#3b82f6', icon: 'ShoppingCart' },
      { id: 'cat_reward', name: 'Keinginan & Gaya Hidup', percentage: 30, color: '#ec4899', icon: 'Gift' },
      { id: 'cat_tabungan', name: 'Tabungan & Cicilan', percentage: 20, color: '#10b981', icon: 'PiggyBank' }
    ]
  },
  {
    name: 'Aturan 60-20-20 (Fokus Kebutuhan & Bebas Cicilan)',
    categories: [
      { id: 'cat_kebutuhan', name: 'Kebutuhan Pokok', percentage: 60, color: '#3b82f6', icon: 'ShoppingCart' },
      { id: 'cat_tabungan', name: 'Tabungan & Investasi', percentage: 20, color: '#10b981', icon: 'PiggyBank' },
      { id: 'cat_reward', name: 'Self Reward', percentage: 20, color: '#ec4899', icon: 'Gift' }
    ]
  }
];

export const DEFAULT_WALLETS = [
  { id: 'w_bca', name: 'Bank BCA', type: 'bank', balance: 5000000, color: '#005caa', icon: 'Landmark' },
  { id: 'w_mandiri', name: 'Bank Mandiri', type: 'bank', balance: 3500000, color: '#003d79', icon: 'Landmark' },
  { id: 'w_gopay', name: 'GoPay', type: 'ewallet', balance: 450000, color: '#00aa13', icon: 'Wallet' },
  { id: 'w_ovo', name: 'OVO / Dana', type: 'ewallet', balance: 250000, color: '#4c2a86', icon: 'Wallet' },
  { id: 'w_cash', name: 'Dompet Tunai', type: 'cash', balance: 800000, color: '#10b981', icon: 'Banknote' }
];

export const DEFAULT_SAVINGS_GOALS = [
  { id: 'sg_1', title: 'Dana Darurat 6 Bulan', targetAmount: 20000000, currentAmount: 8500000, targetDate: '2026-12-31' },
  { id: 'sg_2', title: 'Upgrade Laptop Baru', targetAmount: 15000000, currentAmount: 6000000, targetDate: '2026-10-30' }
];

export const DEFAULT_RECURRING_BILLS = [
  { id: 'rb_1', title: 'Cicilan KPR / Rumah', amount: 1200000, dueDay: 25, categoryId: 'cat_cicilan', walletId: 'w_bca', isPaid: false },
  { id: 'rb_2', title: 'Internet Wi-Fi Indihome/Biznet', amount: 350000, dueDay: 10, categoryId: 'cat_kebutuhan', walletId: 'w_mandiri', isPaid: true },
  { id: 'rb_3', title: 'Langganan Netflix / Spotify', amount: 186000, dueDay: 15, categoryId: 'cat_reward', walletId: 'w_gopay', isPaid: true }
];
