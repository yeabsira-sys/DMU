import {mongoose} from "../config/db.mjs";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI);

let bucket;
const gridFSReady = new Promise((resolve, reject) => {
  conn.once('open', () => {
    bucket = new GridFSBucket(conn.db, { bucketName: 'images' });
    console.log('✅ GridFSBucket initialized');
    resolve();
  });

  conn.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    reject(err);
  });
});

const upload = multer({ storage: multer.memoryStorage() });
export  {bucket, conn, upload, gridFSReady}