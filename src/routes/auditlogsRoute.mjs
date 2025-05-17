import express from 'express'
import { getAuditLogs } from '../controllers/auditlogController.mjs'

const router = express.Router();

 router.get('/', getAuditLogs)
//  router.delete('/')
 export default router