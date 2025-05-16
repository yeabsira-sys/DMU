// Refactored version using native MongoDB GridFSBucket and avoiding deprecated gridfs-stream

import express from "express";
import vhost from "vhost";
import adminApp from '../apps/adminApp.mjs';
import cdaApp from '../apps/cdaApp.mjs';
import stdPortalApp from '../apps/stdPortalApp.mjs';
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";
import { upload, bucket } from "../config/fileStream.mjs";
import newsRouter from './news/newsRoutes.mjs'
import imagesRoutes from './fileRoute/imagesRoutes.mjs'
import { requireJsonBody } from "../middlewares/checkBodyForjson.mjs";

const router = express.Router();

// vhost routes
router.use(requireJsonBody)
router.use(vhost('admin.localhost', adminApp));
router.use(vhost('cda.localhost', cdaApp));
router.use(vhost('studentportal.localhost', stdPortalApp));
router.use('/news', newsRouter)
router.use('/file', imagesRoutes)

// Fetch news
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Stream image
router.get('/image/:filename', async (req, res) => {
  try {
    const filesCollection = conn.db.collection('uploads.files');
    const file = await filesCollection.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: 'No file found' });

    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete image
router.delete('/image/:id', async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    await bucket.delete(objectId);
    res.send('Image deleted');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
