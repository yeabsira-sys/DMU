// import { Worker } from "bullmq";
// import { connection } from "../redisConnection.mjs";
// import { waitForRedis } from "../utils/redisUtils.mjs";
// import { logAction } from './auditLogger.mjs';

// (async () => {
//   const ready = await waitForRedis();
//   if (!ready) {
//     console.warn("Audit worker not started: Redis unavailable.");
//     return;
//   }

//   const auditWorker = new Worker(
//     'audit-logs',
//     async job => {
//       const auditData = job.data;
//       await logAction(auditData);
//     },
//     { connection }
//   );

//   auditWorker.on("completed", job => {
//     console.log(`Audit log job ${job.id} completed.`);
//   });

//   auditWorker.on("failed", (job, err) => {
//     console.error(`Audit log job ${job.id} failed: ${err.message}`);
//   });
// })();
