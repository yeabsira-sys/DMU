import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { schoolSchema, editSchoolSchema } from '../../validations/universityDataValidation.mjs';
import { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } from '../../controllers/universityDataController/schoolController.mjs';
import { validateObjectId } from '../../middlewares/validateObjectId.mjs';
import { objectIdValidation } from '../../validations/objectIdValidation.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs';

const adminSchoolRouter = express.Router();
const publicSchoolRout = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Schools
 *     description: Schools Management
 */

/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schools'
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schools'
 *       400:
 *         description: Validation error
 */
adminSchoolRouter.post('/', auditLogger('creating school'), validate(schoolSchema), createSchool);

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: List of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schools'
 */
publicSchoolRout.get('/', getAllSchools);
adminSchoolRouter.get('/', auditLogger('fetching all schools'), getAllSchools);

/**
 * @swagger
 * /schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schools'
 *       404:
 *         description: School not found
 */
adminSchoolRouter.get('/:id', auditLogger('fetching single school by id'), validateObjectId(objectIdValidation), getSchoolById);
publicSchoolRout.get('/:id', validateObjectId(objectIdValidation), getSchoolById);

/**
 * @swagger
 * /schools/{id}:
 *   patch:
 *     summary: Update a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/editSchools'
 *     responses:
 *       200:
 *         description: School updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/editSchools'
 *       404:
 *         description: School not found
 */
adminSchoolRouter.patch('/:id', auditLogger('updating schools'), validateObjectId(objectIdValidation), validate(editSchoolSchema), updateSchool);

/**
 * @swagger
 * /schools/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted
 *       404:
 *         description: School not found
 */
adminSchoolRouter.delete('/:id', auditLogger('deleting school record'), validateObjectId(objectIdValidation), deleteSchool);

export { adminSchoolRouter, publicSchoolRout };
