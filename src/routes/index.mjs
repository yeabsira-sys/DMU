import express from "express";
import vhost from "vhost";
import adminApp from '../apps/adminApp.mjs';
import cdaApp from '../apps/cdaApp.mjs';
import stdPortalApp from '../apps/stdPortalApp.mjs';
import newsRouter from './news/newsRoutes.mjs'
import imagesRoutes from './fileRoute/imagesRoutes.mjs'
import { requireJsonBody } from "../middlewares/checkBodyForjson.mjs";
import cors from 'cors'
const router = express.Router();
router.use(cors())
// router.use(requireJsonBody)
// vhost routes
router.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});
router.use(vhost('admin.localhost', adminApp));
router.use(vhost('cda.localhost', cdaApp));
router.use(vhost('studentportal.localhost', stdPortalApp));
// router.use('/news', newsRouter)
router.use('/file', imagesRoutes)

export default router;
