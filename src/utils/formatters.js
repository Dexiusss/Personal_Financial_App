// Indonesian Currency & Date Formatter Utilities

export const formatRupiah = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

export const parseRupiahInput = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  // Remove non-digit characters except decimals
  const cleaned = str.replace(/[^\d]/g, '');
  return Number(cleaned) || 0;
};

export const formatTanggal = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
};
