import express from "express";
import { validate } from "../middlewares/validate.mjs";
import {
  createAnnouncement,
  filterAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getHiddenAnnouncements,
  getDeletedAnnouncements,
  toggleAnnouncementIsHidden,
} from "../controllers/announcementController.mjs";
import { validateObjectId } from "../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../validations/objectIdValidation.mjs";
import { auditLogger } from "../middlewares/auditLoger.mjs";
import {
  createAnnouncementValidationSchema,
  updateAnnouncementValidationSchema,
} from "../validations/announcementSchema.mjs";

const adminAnnouncementRouter = express.Router();
const publicAnnouncementRouter = express.Router();

/**
 * @swagger
 * /announcements:
 *   post:
 *     tags:
 *       - Announcements
 *     summary: Create an announcement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAnnouncement'
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Validation error
 */
adminAnnouncementRouter.post(
  "/",
  auditLogger("creating announcement"),
  validate(createAnnouncementValidationSchema),
  createAnnouncement
);

/**
 * @swagger
 * /announcements/search:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Search announcements
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [admission, event, jobopening]
 *         description: Filter by type
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, draft, archived]
 *         description: Filter by status
 *       - in: query
 *         name: isHidden
 *         schema:
 *           type: boolean
 *         description: Filter by hidden
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *         description: Filter by deleted
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
 *         description: Filtered announcement results
 */
publicAnnouncementRouter.get("/search", filterAnnouncements);
adminAnnouncementRouter.get("/search", auditLogger("fetching announcements"), filterAnnouncements);

/**
 * @swagger
 * /announcements/hidden:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get all hidden announcements (admin only)
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
 *         description: List of hidden announcements
 */
adminAnnouncementRouter.get("/hidden", auditLogger("fetching hidden announcements"), getHiddenAnnouncements);

/**
 * @swagger
 * /announcements/deleted:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get all deleted announcements (admin only)
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
 *         description: List of deleted announcements
 */
adminAnnouncementRouter.get("/deleted", auditLogger("fetching deleted announcements"), getDeletedAnnouncements);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get announcement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the announcement
 *     responses:
 *       200:
 *         description: Successful response with announcement data
 *       404:
 *         description: Announcement not found
 */
publicAnnouncementRouter.get("/:id", validateObjectId(objectIdValidation), getAnnouncementById);
adminAnnouncementRouter.get("/:id", auditLogger("fetching announcement by id"), validateObjectId(objectIdValidation), getAnnouncementById);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     tags:
 *       - Announcements
 *     summary: Edit an announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the announcement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAnnouncement'
 *     responses:
 *       200:
 *         description: Announcement successfully updated
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementRouter.patch("/:id", auditLogger("updating announcement"), validate(updateAnnouncementValidationSchema), updateAnnouncement);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     tags:
 *       - Announcements
 *     summary: Delete an announcement (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the announcement
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementRouter.delete("/:id", auditLogger("deleting announcement"), validateObjectId(objectIdValidation), deleteAnnouncement);

/**
 * @swagger
 * /announcements/{id}/toggle-hidden:
 *   patch:
 *     tags:
 *       - Announcements
 *     summary: Toggle isHidden for an announcement (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the announcement
 *     responses:
 *       200:
 *         description: Announcement isHidden toggled
 *       404:
 *         description: Announcement not found
 */
adminAnnouncementRouter.patch("/:id/toggle-hidden", auditLogger("toggle announcement isHidden"), validateObjectId(objectIdValidation), toggleAnnouncementIsHidden);

export { adminAnnouncementRouter, publicAnnouncementRouter };