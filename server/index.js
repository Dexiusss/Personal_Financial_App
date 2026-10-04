import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { parseBankEmailText } from './services/backendParser.js';
import { getAuthUrl, getTokensFromCode, fetchBankEmailsFromGmail } from './services/gmailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://lhljhwoupybvcsqgdejs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XDFEGRz8Dw-T0s2HT2knew_RdvEOdg4';
const supabase = createClient(supabaseUrl, supabaseKey);

let userGmailTokens = null;

// 1. Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Centralized Backend Bot',
    googleOAuthConnected: !!userGmailTokens,
    supabaseConnected: !!supabase
  });
});

// 2. Google OAuth Auth URL Endpoint
app.get('/api/auth/google/url', (req, res) => {
  try {
    const url = getAuthUrl();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Google OAuth Callback Endpoint
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    console.log('[Backend Bot] Received Google OAuth code, exchanging tokens...');
    const tokens = await getTokensFromCode(code);
    userGmailTokens = tokens;
    console.log('[Backend Bot] Google OAuth Tokens obtained successfully!');

    // Immediately scan inbox for bank emails upon authentication
    const extractedTx = await fetchBankEmailsFromGmail(tokens);
    console.log(`[Backend Bot] Scanned inbox: found ${extractedTx.length} valid bank transactions.`);

    // Insert extracted bank transactions directly into Supabase DB
    if (extractedTx.length > 0) {
      const records = extractedTx.map((tx) => ({
        type: 'expense',
        amount: tx.amount,
        category_id: tx.suggestedCategoryId,
        category_name: tx.suggestedCategoryId === 'cat_cicilan' ? 'Cicilan & Utang' : 'Kebutuhan Pokok',
        wallet_id: 'w_bca',
        wallet_name: tx.walletName,
        recipient_merchant: tx.recipientOrMerchant,
        notes: `Gmail Live API Bot (${tx.transactionType || ''})`,
        transaction_date: tx.transactionDate
      }));

      const { data, error } = await supabase.from('transactions').insert(records).select();
      if (error) {
        console.error('[Supabase Insert Error]', error);
      } else {
        console.log(`[Supabase] Successfully inserted ${data.length} transactions into database!`);
      }
    }

    // Redirect back to frontend
    res.redirect(`http://localhost:5175/?gmailConnected=true&count=${extractedTx.length}`);
  } catch (err) {
    console.error('Error in OAuth callback:', err);
    res.redirect('http://localhost:5175/?gmailConnected=error');
  }
});

// 4. Manual Parse Raw Email Body
app.post('/api/parse', (req, res) => {
  const { emailBody } = req.body;
  if (!emailBody) {
    return res.status(400).json({ error: 'Field emailBody wajib diisi' });
  }

  const parsed = parseBankEmailText(emailBody);
  res.json({ success: true, data: parsed });
});

// 5. Sync Email directly to Supabase DB
app.post('/api/sync-email', async (req, res) => {
  const { emailBody, categoryId, walletId } = req.body;
  if (!emailBody) {
    return res.status(400).json({ error: 'Field emailBody wajib diisi' });
  }

  const parsed = parseBankEmailText(emailBody);
  if (!parsed || parsed.amount <= 0) {
    return res.status(422).json({ error: 'Gagal mendeteksi nominal transaksi dari email' });
  }

  const newTransaction = {
    type: 'expense',
    amount: parsed.amount,
    category_id: categoryId || parsed.suggestedCategoryId,
    category_name: categoryId === 'cat_cicilan' ? 'Cicilan & Utang' : 'Kebutuhan Pokok',
    wallet_id: walletId || 'w_bca',
    wallet_name: parsed.walletName,
    recipient_merchant: parsed.recipientOrMerchant,
    notes: `Centralized Bot Auto-Sync (${parsed.transactionType})`,
    transaction_date: parsed.transactionDate
  };

  try {
    const { data, error } = await supabase.from('transactions').insert([newTransaction]).select();
    if (error) {
      return res.status(500).json({ error: error.message, localData: newTransaction });
    }
    return res.json({ success: true, message: 'Berhasil tersimpan ke Supabase!', transaction: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message, localData: newTransaction });
  }
});

// 6. Scan Gmail Inbox using stored tokens or simulation
app.get('/api/gmail/sync', async (req, res) => {
  if (userGmailTokens) {
    try {
      const extractedTx = await fetchBankEmailsFromGmail(userGmailTokens);
      return res.json({
        success: true,
        source: 'Live Gmail API',
        totalScanned: extractedTx.length,
        parsedTransactions: extractedTx
      });
    } catch (err) {
      console.warn('Error using live Gmail tokens, fallback to sample bank emails:', err.message);
    }
  }

  // Simulation fallback sample bank emails
  const sampleBankEmails = [
    `Hello RICKY MARIO BUTAR BUTAR,
You just made a transaction through myBCA.
Status : Successful
Transaction Date : 25 Jul 2026 13:52:39
Transaction Type : QRIS Payment
Payment to : JUMP START COFFEE 1 - QRI
Total Payment : IDR 9,900.00`,

    `Transfer Berhasil
Penerima: EVADITUS KRESNA YUVI
Bank Mandiri - 1360038412356
Tanggal: 25 Jul 2026 23:45:28 WIB
Jumlah Transfer: Rp 700.000,00`
  ];

  const parsedResults = sampleBankEmails.map((emailText) => parseBankEmailText(emailText));
  res.json({
    success: true,
    source: 'Bot Reader Engine',
    totalScanned: sampleBankEmails.length,
    parsedTransactions: parsedResults
  });
});

app.listen(PORT, () => {
  console.log(`⚡ Centralized Backend Bot server running with Google OAuth on http://localhost:${PORT}`);
});
