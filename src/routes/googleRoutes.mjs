import express from 'express';
import { createSheet, createDoc, createCalendarEvent } from '../google/googleController.mjs';

const router = express.Router();


/**
 * @swagger
 * /google/create-sheet:
 *   post:
 *     summary: Create a public Google Sheet
 *     tags: [Google]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Google Sheet created and shared publicly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sheet created
 *                 link:
 *                   type: string
 *                   example: https://docs.google.com/spreadsheets/d/{sheetId}/edit
 */

router.post('/create-sheet', createSheet);

/**
 * @swagger
 * /google/create-doc:
 *   post:
 *     summary: Create a public Google Document
 *     tags: [Google]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Google Doc created and shared publicly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Document created
 *                 link:
 *                   type: string
 *                   example: https://docs.google.com/document/d/{docId}/edit
 */

router.post('/create-doc', createDoc);

/**
 * @swagger
 * /google/create-event:
 *   post:
 *     summary: Create a Google Calendar event (public calendar recommended)
 *     tags: [Google]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 example: Public Event
 *               start:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-30T10:00:00Z
 *               end:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-30T11:00:00Z
 *     responses:
 *       200:
 *         description: Calendar event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event created
 *                 link:
 *                   type: string
 *                   example: https://www.google.com/calendar/event?eid=xxxx
 */

router.post('/create-event', createCalendarEvent);



export default router;
