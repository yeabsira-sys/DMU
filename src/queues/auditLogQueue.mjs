// auditQueue.js
import { Queue } from 'bullmq';
import { connection } from '../redisConnection.mjs'; 

const auditQueue = new Queue('audit-logs', { connection });

export const enqueueAuditLog  = async (logData) => {
    console.log('audit log queue adder function!')
await auditQueue.add('audit-logs', logData)
}