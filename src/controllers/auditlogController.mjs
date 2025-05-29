import { AuditLogs } from '../models/Auditlogs.mjs';
import { auditSearchSchema } from '../validations/auditSerchSchema.mjs';
import * as XLSX from 'xlsx'
import { format} from '@fast-csv/format'
import fs from 'fs'
import { flattenObject } from '../utils/objectFlatter.mjs';
import {sanitizeDocument} from '../utils/sanitize.mjs'
export const getAuditLogs = async (req, res) => {
  try {
    const {
      actor,
      action,
      success,
      from,
      to,
      page = 1,
      limit = 10,
      userAgent,
      ip,
    } = req.query;

    const query = {};

    if (actor) query.actor = actor;
    if (action) query.action = { $regex: action, $options: 'i' };
    if (userAgent) query.userAgent = { $regex: userAgent, $options: 'i' };
    if (ip) query.ip = ip;
    if (success !== undefined) query.success = success === 'true';
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    // audit SEARCH and get all search
    const isValid = auditSearchSchema.validate(query)
    if(!isValid) return res.status(400).json({"message": "incorrect query parameter / filters"})
    const skip = (page - 1) * limit;
    
    const logs = await AuditLogs.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLogs.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: logs,
    });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};


export const exportAuditlogs = async (req, res) => {

// try {
//     const cursor = AuditLogs.find().lean().cursor();

//     let flattenedData = [];
//     for await (const doc of cursor) {
//       const flatDoc = flattenObject(doc);
//       flattenedData.push(flatDoc);
//     }

//     const worksheet = XLSX.utils.json_to_sheet(flattenedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
//     res.setHeader('Content-Disposition', 'attachment; filename=auditlogs.xlsx');
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.send(buffer);
//   } catch (err) {
//     console.error('Export error:', err);
//     res.status(500).json({ error: 'Export failed' });
//   }


try {
    const data = await AuditLogs.find().lean();
    
    const sanitized = data.map(sanitizeDocument);
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.setHeader('Content-Type', 'text/csv');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    sanitized.forEach((doc) => {
      csvStream.write(flattenObject(doc)); // if you want flattenObject(doc), wrap it here
    });

    csvStream.end();
  } catch (err) {
    console.error('CSV export failed:', err);
    res.status(500).json({ error: 'Failed to export logs.' });
  }
}