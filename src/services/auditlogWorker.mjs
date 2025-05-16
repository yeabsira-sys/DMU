import { Worker } from "bullmq";
import { connection } from "../redisConnection.mjs";
import { logAction } from './auditLogger.mjs'

const auditWorker = new Worker('audit-logs', async job => {
  const auditData = job.data;
    await logAction(auditData)
}, { connection });

auditWorker.on('completed', job => {
  console.log(`Audit log job ${job.id} completed.`);
});

auditWorker.on('failed', (job, err) => {
  console.error(`Audit log job ${job.id} failed: ${err.message}`);
}); 