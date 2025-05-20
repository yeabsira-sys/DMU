// // redisConnection.mjs
// import Redis from "ioredis";

// const connection = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: 1,
//   enableReadyCheck: true
// });

// let redisAvailable = false;

// connection.on("ready", () => {
//   redisAvailable = true;
//   console.log("Redis connection is ready.");
// });

// connection.on("error", (err) => {
//   redisAvailable = false;
//   console.warn("Redis connection error:", err.message);
// });

// export { connection, redisAvailable };
