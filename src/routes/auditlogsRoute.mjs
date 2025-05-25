import express from "express";
import { getAuditLogs } from "../controllers/auditlogController.mjs";

const auditLogRouter = express.Router();

/**
 * @swagger
 * /auditlogs:
 *   get:
 *     tags:
 *       - AuditLogs
 *     summary: Get audit logs with filtering and pagination
 *     description: Retrieve audit logs with optional filters and pagination.
 *     parameters:
 *       - in: query
 *         name: actor
 *         schema:
 *           type: string
 *         description: Filter by actor (user ID or name)
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action (supports partial match)
 *       - in: query
 *         name: success
 *         schema:
 *           type: boolean
 *         description: Filter by success (true/false)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for timestamp filter
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for timestamp filter
 *       - in: query
 *         name: userAgent
 *         schema:
 *           type: string
 *         description: Filter by user agent (supports partial match)
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: Filter by IP address
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Failed to fetch audit logs
 */
auditLogRouter.get("/", getAuditLogs);

export { auditLogRouter };