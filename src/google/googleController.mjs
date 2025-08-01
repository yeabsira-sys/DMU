import { getGoogleClient } from './googleClient.mjs';
import { DocLink } from '../models/googleDocs.mjs';

export const createSheet = async (req, res) => {
  const client = getGoogleClient(req.user.accessToken);
  const name = req.body?.name
  const result = await client.sheets.spreadsheets.create({
    resource: { properties: { title: 'Public Sheet' } }
  });

  const fileId = result.data.spreadsheetId;

  await client.drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });
  const link = `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
  await DocLink.create({
    name: name,
    link: link
  })
    res.setHeader('Content-Type', 'application/json');
 return res.status(201).json({ message: 'Sheet created', link: link });
};


export const createDoc = async (req, res) => {
  const name = req.body?.name || ''
  const client = getGoogleClient(req.user.accessToken);

  const result = await client.docs.documents.create({
    requestBody: { title: 'Public Document' }
  });

  const fileId = result.data.documentId;

  await client.drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  const link = `https://docs.google.com/document/d/${fileId}/edit`;
  await DocLink.create({
    name,
    link
  })
  res.json({ message: 'Document created', link });
};


export const createCalendarEvent = async (req, res) => {
  const client = getGoogleClient(req.user.accessToken);
  const name = req.body?.name
  const result = await client.calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: 'Public Event',
      start: { dateTime: '2025-05-30T10:00:00Z' },
      end: { dateTime: '2025-05-30T11:00:00Z' }
    }
  });

  const htmlLink = result.data.htmlLink; // event URL
  await DocLink.create({
    name,
    htmlLink
  })
  res.json({ message: 'Event created', link: htmlLink });
};

