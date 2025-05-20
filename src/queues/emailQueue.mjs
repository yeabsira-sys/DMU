// // emailQueue.js
// import { Queue } from "bullmq";
// import { connection } from "../redisConnection.mjs";
// import { safeQueueAdd } from "../utils/redisUtils.mjs";

// const emailQueue = new Queue("emailQueue", { connection });

// async function queueEmail(emailData) {
//   const { to, subject, html } = emailData;
//   await safeQueueAdd(emailQueue, "sendEmail", { to, subject, html });
// }

// export default queueEmail;
