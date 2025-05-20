// import { Worker } from "bullmq";
// import dotenv from "dotenv";
// import { connection } from "../redisConnection.mjs";
// import { waitForRedis } from "../utils/redisUtils.mjs";
// import { sendCredentialsEmail } from './mailer.mjs';

// dotenv.config();

// (async () => {
//   const ready = await waitForRedis();
//   if (!ready) {
//     console.warn("Email worker not started: Redis unavailable.");
//     return;
//   }

//   const worker = new Worker("emailQueue", async (job) => {
//     const { to, subject, html } = job.data;
//     try {
//       await sendCredentialsEmail(to, subject, html);
//       console.log(`Email sent to ${to}`);
//     } catch (error) {
//       console.error(`Failed to send email to ${to}: ${error.message}`);
//     }
//   }, { connection });

//   worker.on("failed", (job, err) => {
//     console.error(`Job ${job?.id || 'N/A'} failed: ${err.message}`);
//   });
// })();
