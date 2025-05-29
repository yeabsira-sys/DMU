import { google } from 'googleapis';
import dotenv from 'dotenv'
dotenv.config()

export const getGoogleClient = (accessToken) => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK
  );
  auth.setCredentials({ access_token: accessToken });
  return {
    drive: google.drive({ version: 'v3', auth }),
    docs: google.docs({ version: 'v1', auth }),
    sheets: google.sheets({ version: 'v4', auth }),
    calendar: google.calendar({ version: 'v3', auth }),
  };
};

