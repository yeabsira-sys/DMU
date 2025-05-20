import express from "express";
import vhost from "vhost";
import adminApp from '../subnets/adminApp.mjs';
import cdaApp from '../subnets/cdaApp.mjs';
import stdPortalApp from '../subnets/stdPortalApp.mjs';
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

router.use('/admin', adminApp);
router.use('/cda', cdaApp);
router.use('/studentPortal', stdPortalApp);
router.use('/', publicRoutes)
export default router;
