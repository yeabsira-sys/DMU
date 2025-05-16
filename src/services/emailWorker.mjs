import { Worker } from "bullmq";
import { Redis } from 'ioredis'
import {sendCredentialsEmail} from './mailer.mjs'
import dotenv from "dotenv";

dotenv.config()
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const worker = new Worker("emailQueue", async (job) => {
  const { to, subject, html } = job.data;
    console.log(`Processing job: ${to}`);
    try {
      await sendCredentialsEmail(to, subject, html);
  console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`failed to send the email ${error}`)
    }
  
}, { connection });

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
