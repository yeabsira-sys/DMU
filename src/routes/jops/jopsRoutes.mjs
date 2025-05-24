import express from "express";
import { validate } from "../../middlewares/validate.mjs";
import {
  createJobValidationSchema,
  editJobValidationSchema,
  searchJobValidationSchema,
} from "../../validations/jopsValidationSchema.mjs";
import {
  createJob,
  filterJobs,
  getJobById,
  updateJob,
  deleteJob,
    getHiddenJobs,
    toggleJobIsHidden,
} from "../../controllers/jopsController.mjs";
import { validateObjectId } from "../../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../../validations/objectIdValidation.mjs";
import { auditLogger } from "../../middlewares/auditLoger.mjs";

const adminJobRouter = express.Router();
const publicJobRouter = express.Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a job posting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 */
adminJobRouter.post("/", auditLogger('creating job'), validate(createJobValidationSchema), createJob);

/**
 * @swagger
 * /jobs/search:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Search job postings
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by job title
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *         description: Filter by job type
 *       - in: query
 *         name: jobLevel
 *         schema:
 *           type: string
 *         description: Filter by job level
 *       - in: query
 *         name: isHidden
 *         schema:
 *           type: boolean
 *         description: Filter by visibility
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
 *         description: Filtered job results
 */
publicJobRouter.get('/search', validate(searchJobValidationSchema), filterJobs);
adminJobRouter.get('/search', auditLogger('fetching jops'), validate(searchJobValidationSchema), filterJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Successful response with job data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       404:
 *         description: Job not found
 */
publicJobRouter.get("/:id", validateObjectId(objectIdValidation), getJobById);
adminJobRouter.get("/:id", auditLogger('fetching jop by id'), validateObjectId(objectIdValidation), getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Edit a job posting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditJob'
 *     responses:
 *       200:
 *         description: Job successfully updated
 *       404:
 *         description: Job not found
 */
adminJobRouter.patch("/:id", auditLogger('updating job'), validate(editJobValidationSchema), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job posting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
adminJobRouter.delete("/:id", auditLogger('deleting jop posts'), validateObjectId(objectIdValidation), deleteJob);

// ...existing code...

/**
 * @swagger
 * /jobs/admin/hidden:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get all hidden jobs (admin only)
 *     description: Returns all jobs where isHidden is true. Admin access required.
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
 *         description: List of hidden jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobResponse'
 */
adminJobRouter.get(
  "/admin/hidden",
  auditLogger("fetching hidden jobs"),
  getHiddenJobs
);

/**
 * @swagger
 * /jops/{id}/toggle-hidden:
 *   put:
 *     tags:
 *       - Jobs
 *     summary: Toggle isHidden for a job (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the job
 *     responses:
 *       200:
 *         description: Job isHidden toggled
 *       404:
 *         description: Job not found
 */
adminJobRouter.put("/:id/toggle-hidden", auditLogger("toggle job isHidden"), validateObjectId(objectIdValidation), toggleJobIsHidden);




export { adminJobRouter, publicJobRouter };