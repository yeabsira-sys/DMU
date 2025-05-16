import { Queue } from "bullmq";
import { connection } from "../redisConnection.mjs";

const emailQueue = new Queue("emailQueue", { connection });

async function queueEmail(emailData) {
  const { to, subject, html } = emailData
  await emailQueue.add("sendEmail", { to, subject, html });
}

export default queueEmail;
