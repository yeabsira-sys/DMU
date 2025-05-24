import express from "express";
import { validate } from "../../middlewares/validate.mjs";
import {
  createEvent,
  filterEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventIsHidden,
    getHiddenEvents
} from "../../controllers/eventController.mjs";
import { validateObjectId } from "../../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../../validations/objectIdValidation.mjs";
import { auditLogger } from "../../middlewares/auditLoger.mjs";

const adminEventRouter = express.Router();
const publicEventRouter = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create an event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
*/
adminEventRouter.post("/", auditLogger("creating event"), createEvent);

/**
 * @swagger
 * /events/hidden:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get all hidden events (admin only)
 *     description: Returns all events where isHidden is true. Admin access required.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of hidden events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventResponse'
 */
adminEventRouter.get(
  "/hidden",
  auditLogger("fetching hidden events"),
  getHiddenEvents
);
export { adminEventRouter, publicEventRouter };
/**
 * @swagger
 * /events/search:
 *   get:
 *     tags:
 *       - Events
 *     summary: Search events
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by event title
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *         description: Filter by event type
 *       - in: query
 *         name: organizer
 *         schema:
 *           type: string
 *         description: Filter by organizer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Filtered event results
 */
publicEventRouter.get("/search", filterEvents);
adminEventRouter.get("/search", auditLogger("fetching events"), filterEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: Successful response with event data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       404:
 *         description: Event not found
 */
publicEventRouter.get("/:id", validateObjectId(objectIdValidation), getEventById);
adminEventRouter.get("/:id", auditLogger("fetching event by id"), validateObjectId(objectIdValidation), getEventById);

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     tags:
 *       - Events
 *     summary: Edit an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditEvent'
 *     responses:
 *       200:
 *         description: Event successfully updated
 *       404:
 *         description: Event not found
 */
adminEventRouter.patch("/:id", auditLogger("updating event"), updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
adminEventRouter.delete("/:id", auditLogger("deleting event"), validateObjectId(objectIdValidation), deleteEvent);

/**
 * @swagger
 * /events/{id}/toggle-hidden:
 *   put:
 *     tags:
 *       - Events
 *     summary: Toggle isHidden for an event (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: Event isHidden toggled
 *       404:
 *         description: Event not found
 */
adminEventRouter.put(
  "/:id/toggle-hidden",
  auditLogger("toggle event isHidden"),
  validateObjectId(objectIdValidation),
  toggleEventIsHidden
);
