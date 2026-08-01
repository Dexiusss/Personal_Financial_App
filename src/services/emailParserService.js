// Smart Email Expense Parser Engine & Centralized Bot Communicator

const CENTRAL_BOT_URL = 'http://localhost:5000';

export const parseBankEmailText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const text = rawText.trim();
  let amount = 0;
  let recipientOrMerchant = '';
  let transactionType = '';
  let walletName = '';
  let transactionDate = new Date().toISOString();
  let suggestedCategoryId = '';

  // 1. myBCA Pattern Extractor
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
      const parsedDate = new Date(dateMatch[1].trim());
      if (!isNaN(parsedDate.getTime())) transactionDate = parsedDate.toISOString();
    }
  } 
  // 2. Bank Mandiri Pattern Extractor
  else if (text.includes('Bank Mandiri') || text.includes('Transfer Berhasil') || text.includes('Rekening Sumber')) {
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
      const parsedDate = new Date(`${tanggalMatch[1]} ${timeStr}`);
      if (!isNaN(parsedDate.getTime())) transactionDate = parsedDate.toISOString();
    }
  } 
  // 3. Generic / E-Wallet
  else {
    if (text.match(/gopay/i)) walletName = 'GoPay';
    else if (text.match(/ovo/i)) walletName = 'OVO / Dana';
    else if (text.match(/bri/i)) walletName = 'Bank BRI';
    else if (text.match(/bni/i)) walletName = 'Bank BNI';

    const amountMatch = text.match(/(?:Jumlah|Total|Nominal|Amount|Bayar)\s*(?::\s*)?(?:Rp|IDR)?\s*([\d.,]+)/i) || 
                        text.match(/(?:Rp|IDR)\s*([\d.,]+)/i);
    if (amountMatch) amount = parseAmountString(amountMatch[1]);

    const merchantMatch = text.match(/(?:Penerima|Payment to|Merchant|Kepada|Store)\s*(?::\s*)?([^\n]+)/i);
    if (merchantMatch) recipientOrMerchant = merchantMatch[1].trim();

    const typeMatch = text.match(/(?:Jenis Transaksi|Transaction Type|Tipe)\s*(?::\s*)?([^\n]+)/i);
    if (typeMatch) transactionType = typeMatch[1].trim();
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
    rawText,
    amount,
    recipientOrMerchant: recipientOrMerchant || 'Transaksi Email',
    transactionType: transactionType || '',
    walletName: walletName || 'Bank BCA',
    transactionDate,
    suggestedCategoryId,
    isParsedSuccess: amount > 0
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

// -------------------------------------------------------------
// Centralized Bot Inbox Sync (Web & Mobile API Bridge)
// -------------------------------------------------------------
export const fetchGmailInboxNotifications = async () => {
  try {
    const response = await fetch(`${CENTRAL_BOT_URL}/api/gmail/sync`);
    if (response.ok) {
      const data = await response.json();
      return data.parsedTransactions.map((tx, idx) => ({
        id: `bot_msg_${idx}_${Date.now()}`,
        sender: `${tx.walletName} Bot Reader`,
        subject: `Notifikasi ${tx.recipientOrMerchant}`,
        date: tx.transactionDate,
        snippet: `Ekstraksi Centralized Bot: ${tx.recipientOrMerchant} Rp ${tx.amount}`,
        rawBody: `Transaction Date: ${tx.transactionDate}\nPayment to: ${tx.recipientOrMerchant}\nTotal Payment: IDR ${tx.amount}`
      }));
    }
  } catch (err) {
    console.warn('Centralized Bot Server unreachable, fallback to local reader simulation:', err);
  }

  // Fallback if bot server is offline
  return [
    {
      id: 'msg_101',
      sender: 'myBCA <no-reply@bca.co.id>',
      subject: 'myBCA Transaction Notification - QRIS Payment',
      date: new Date().toISOString(),
      snippet: 'You just made a transaction through myBCA. Payment to JUMP START COFFEE 1 - QRI...',
      rawBody: `Hello RICKY MARIO BUTAR BUTAR,
You just made a transaction through myBCA.
Here are the details of your transaction :

Status\t:\tSuccessful
Transaction Date\t:\t25 Jul 2026 13:52:39
Transaction Type\t:\tQRIS Payment
Payment to\t:\tJUMP START COFFEE 1 - QRI
Merchant Location\t:\tJakarta Selat, 12210, ID
Acquirer\t:\tBANK MANDIRI
Total Payment\t:\tIDR 9,900.00`
    },
    {
      id: 'msg_102',
      sender: 'Bank Mandiri <notification@bankmandiri.co.id>',
      subject: 'Transfer Berhasil - Bank Mandiri',
      date: new Date().toISOString(),
      snippet: 'Berikut adalah detail transaksi Anda: Penerima EVADITUS KRESNA YUVI...',
      rawBody: `Transfer Berhasil
Halo RICKY MARIO BUTAR BUTAR,
Penerima: EVADITUS KRESNA YUVI
Bank Mandiri - 1360038412356
Tanggal: 25 Jul 2026
Jumlah Transfer: Rp 700.000,00`
    }
  ];
};
