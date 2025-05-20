import agenda from '../agendaInstance.mjs';
import { logAction } from '../services/auditLogger.mjs';

agenda.define('log-audit', async job => {
  const auditData = job.attrs.data;
  try {
    await logAction(auditData);
    console.log('Audit log created.');
  } catch (error) {
    console.error('Failed to log audit data:', error.message);
  }
});

export async function enqueueAuditLog(logData) {
  try {
    await agenda.start();
    await agenda.now('log-audit', logData);
  } catch (err) {
    console.error('Failed to queue audit log job:', err.message);
  }
}
