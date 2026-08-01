import { google } from 'googleapis';
import dotenv from 'dotenv';
import { parseBankEmailText } from './backendParser.js';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

export const createOAuth2Client = () => {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
};

// 1. Generate Auth URL for user to grant Gmail Read permission
export const getAuthUrl = () => {
  const oauth2Client = createOAuth2Client();
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes
  });
};

// 2. Exchange Authorization Code for Tokens
export const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// 3. Scan Gmail Inbox for Bank Emails using Access Token
export const fetchBankEmailsFromGmail = async (tokens) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Broad search query matching bank domains & financial keywords
  const query = 'Rp OR IDR OR Transfer OR BCA OR Mandiri OR QRIS OR Payment OR Berhasil OR Gopay OR OVO';

  try {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20
    });

    const messages = listRes.data.messages || [];
    console.log(`[Gmail API] Scanned ${messages.length} messages matching query: "${query}"`);

    const parsedTransactions = [];

    for (const msg of messages) {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full'
      });

      const payload = msgRes.data.payload;
      let bodyText = msgRes.data.snippet || '';

      if (payload && payload.parts) {
        const textPart = payload.parts.find((p) => p.mimeType === 'text/plain') || payload.parts[0];
        if (textPart && textPart.body && textPart.body.data) {
          bodyText = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      } else if (payload && payload.body && payload.body.data) {
        bodyText = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }

      console.log(`[Gmail API] Subject/Snippet: ${msgRes.data.snippet.slice(0, 60)}...`);

      const parsed = parseBankEmailText(bodyText);
      if (parsed && parsed.amount > 0) {
        parsedTransactions.push({
          id: msg.id,
          snippet: msgRes.data.snippet,
          ...parsed
        });
      }
    }

    console.log(`[Gmail API] Successfully parsed ${parsedTransactions.length} transactions with valid amounts!`);
    return parsedTransactions;
  } catch (err) {
    console.error('Error scanning Gmail API:', err);
    throw err;
  }
};
