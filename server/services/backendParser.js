// Server-side Regex Pattern Extractor for Bank Notification Emails

export const parseBankEmailText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const text = rawText.trim();
  let amount = 0;
  let recipientOrMerchant = '';
  let transactionType = '';
  let walletName = 'Bank BCA';
  let transactionDate = new Date().toISOString();
  let suggestedCategoryId = '';

  // 1. myBCA QRIS / Transfer Notification
  if (text.includes('myBCA') || text.includes('Customer PAN') || text.includes('Merchant Location')) {
    walletName = 'Bank BCA';
    
    const typeMatch = text.match(/Transaction Type\s*:\s*(.+)/i);
    if (typeMatch) transactionType = typeMatch[1].trim();

    const merchantMatch = text.match(/Payment to\s*:\s*(.+)/i);
    if (merchantMatch) recipientOrMerchant = merchantMatch[1].trim();

    const amountMatch = text.match(/Total Payment\s*:\s*(?:IDR|Rp)?\s*([\d.,]+)/i);
    if (amountMatch) amount = parseAmountString(amountMatch[1]);

    const dateMatch = text.match(/Transaction Date\s*:\s*(.+)/i);
    if (dateMatch) {
      const pDate = new Date(dateMatch[1].trim());
      if (!isNaN(pDate.getTime())) transactionDate = pDate.toISOString();
    }
  } 
  // 2. Bank Mandiri Transfer Notification
  else if (text.includes('Bank Mandiri') || text.includes('Transfer Berhasil')) {
    walletName = 'Bank Mandiri';
    transactionType = 'Transfer Bank';

    const amountMatch = text.match(/Jumlah Transfer\s*(?:Rp|IDR)?\s*([\d.,]+)/i);
    if (amountMatch) amount = parseAmountString(amountMatch[1]);

    const penerimaMatch = text.match(/Penerima\s*([\s\S]*?)(?:Bank|Tanggal|Jam|Jumlah|No\. Referensi)/i);
    if (penerimaMatch) {
      recipientOrMerchant = penerimaMatch[1].replace(/\n/g, ' ').trim();
    }

    const tanggalMatch = text.match(/Tanggal\s*([0-9]{1,2}\s+[A-Za-z]{3}\s+[0-9]{4})/i);
    const jamMatch = text.match(/Jam\s*([0-9]{2}:[0-9]{2}:[0-9]{2})/i);
    if (tanggalMatch) {
      const timeStr = jamMatch ? jamMatch[1] : '00:00:00';
      const pDate = new Date(`${tanggalMatch[1]} ${timeStr}`);
      if (!isNaN(pDate.getTime())) transactionDate = pDate.toISOString();
    }
  } 
  // 3. Generic / E-Wallet (GoPay, OVO, Dana, BRI, BNI, etc.)
  else {
    if (text.match(/gopay/i)) walletName = 'GoPay';
    else if (text.match(/ovo/i)) walletName = 'OVO / Dana';
    else if (text.match(/bri/i)) walletName = 'Bank BRI';

    const amountMatch = text.match(/(?:Jumlah|Total|Nominal|Amount|Bayar)\s*(?::\s*)?(?:Rp|IDR)?\s*([\d.,]+)/i) || 
                        text.match(/(?:Rp|IDR)\s*([\d.,]+)/i);
    if (amountMatch) amount = parseAmountString(amountMatch[1]);

    const merchantMatch = text.match(/(?:Penerima|Payment to|Merchant|Kepada|Store)\s*(?::\s*)?([^\n]+)/i);
    if (merchantMatch) recipientOrMerchant = merchantMatch[1].trim();
  }

  // Category Inference
  const corpus = (recipientOrMerchant + ' ' + transactionType + ' ' + text).toLowerCase();
  if (corpus.includes('coffee') || corpus.includes('kopi') || corpus.includes('jump start') || corpus.includes('starbucks')) {
    suggestedCategoryId = 'cat_reward';
  } else if (corpus.includes('cicilan') || corpus.includes('kpr') || corpus.includes('angsuran') || corpus.includes('utang')) {
    suggestedCategoryId = 'cat_cicilan';
  } else if (corpus.includes('indomaret') || corpus.includes('alfamart') || corpus.includes('pln') || corpus.includes('supermarket')) {
    suggestedCategoryId = 'cat_kebutuhan';
  } else if (corpus.includes('tabungan') || corpus.includes('investasi') || corpus.includes('deposito')) {
    suggestedCategoryId = 'cat_tabungan';
  }

  return {
    amount,
    recipientOrMerchant: recipientOrMerchant || 'Transaksi Email',
    transactionType: transactionType || 'Pengeluaran',
    walletName,
    transactionDate,
    suggestedCategoryId: suggestedCategoryId || 'cat_kebutuhan',
    isSuccess: amount > 0
  };
};

const parseAmountString = (str) => {
  if (!str) return 0;
  let cleaned = str;
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts[parts.length - 1].length === 3) cleaned = cleaned.replace(/\./g, '');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }
  return parseFloat(cleaned) || 0;
};
