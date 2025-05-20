// // redisUtils.mjs
// import { connection } from "../redisConnection.mjs";

// let redisReady = false;

// connection.on("ready", () => {
//   redisReady = true;
//   console.log("Redis is ready.");
// });

// connection.on("error", (err) => {
//   redisReady = false;
//   console.warn("Redis error:", err.message);
// });

// export function isRedisReady() {
//   return redisReady;
// }

// export async function waitForRedis(timeout = 30000) {
//   const start = Date.now();
//   while (!redisReady && Date.now() - start < timeout) {
//     await new Promise(res => setTimeout(res, 10000));
//   }
//   return redisReady;
// }

// export async function safeQueueAdd(queue, jobName, data, opts = {}) {
//   if (!isRedisReady()) {
//     console.warn(`[${jobName}] Skipped: Redis unavailable.`);
//     return;
//   }
//   try {
//     await queue.add(jobName, data, opts);
//   } catch (err) {
//     console.error(`[${jobName}] Failed to queue:`, err.message);
//   }
// }
