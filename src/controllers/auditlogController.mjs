import { AuditLogs } from '../models/Auditlogs.mjs';
import { auditSearchSchema } from '../validations/auditSerchSchema.mjs';


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
