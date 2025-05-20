import  {enqueueAuditLog} from '../queues/auditJob.mjs';
import extractMeta from '../utils/extractMetadata.mjs';

export const auditLogger = (actionDescription) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
const actor = req.user?.id || 'anonymous'; // Adjust based on your auth system
    const target = req.params?.id || null;

    const meta = extractMeta(req);

    const auditLog = {
      action: actionDescription,
      actor,
      target,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      changes: req.changes || null,
      success: res.statusCode < 400, 
      meta,
    };

    // Send to audit queue asynchronously
    await enqueueAuditLog(auditLog).catch((err) => {
      console.error('Failed to enqueue audit log:', err);
    });

})

next();
  };
};
