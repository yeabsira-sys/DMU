const { google } = require('googleapis');
import { google } from 'googleapapis'
const oauth2Client = new google.auth.OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);

// Step 1: Redirect admin to Google login
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
    ],
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Save `tokens` to DB for later use
  res.send('Login successful');
});
