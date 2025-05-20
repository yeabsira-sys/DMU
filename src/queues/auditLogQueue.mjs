// // auditQueue.js
// import { Queue } from 'bullmq';
// import { connection } from '../redisConnection.mjs';
// import { safeQueueAdd } from '../utils/redisUtils.mjs';

// const auditQueue = new Queue('audit-logs', { connection });

// const enqueueAuditLog = async (logData) => {
//   await safeQueueAdd(auditQueue, "audit-logs", logData);
// };

// export default enqueueAuditLog;
