import express from "express";
import vhost from "vhost";
import adminApp from '../subnets/adminApp.mjs';
import cdaApp from '../subnets/cdaApp.mjs';
import stdPortalApp from '../subnets/stdPortalApp.mjs';
import imagesRoutes from './fileRoute/imagesRoutes.mjs'
import { requireJsonBody } from "../middlewares/checkBodyForjson.mjs";
import publicRoutes from '../subnets/publicRoutes.mjs'
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
router.use('/', publicRoutes)
//  router.use('/', newsRoutes)
router.use('/file', imagesRoutes)

export default router;
