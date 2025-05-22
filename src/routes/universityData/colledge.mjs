import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { collegeSchema, editCollegeSchema } from '../../validations/universityDataValidation.mjs';
import  { auditLogger } from '../../middlewares/auditLoger.mjs'
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';
import { validateObjectId } from '../../middlewares/validateObjectID.mjs';
import { createCollege, getAllColleges, getCollegeById, updateCollege, deleteColledge } from '../../controllers/universityDataController/colledgeController.mjs'
const adminColledgeRouter = express.Router();
const publicColledgeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: College
 *     description: College Management
 */

/**
 * @swagger
 * /college:
 *   post:
 *     summary: Create a new college
 *     tags: [College]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/College'
 *     responses:
 *       201:
 *         description: College created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/College'
 *       400:
 *         description: Validation error
 */
adminColledgeRouter.post('/', auditLogger('creating colleges'),  validate(collegeSchema), createCollege);

/**
 * @swagger
 * /college:
 *   get:
 *     summary: Get all colleges
 *     tags: [College]
 *     responses:
 *       200:
 *         description: List of colleges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/editColleges'
 */
adminColledgeRouter.get('/', auditLogger('fetching all colledges'), getAllColleges);
publicColledgeRouter.get('/', getAllColleges);

/**
 * @swagger
 * /college/{id}:
 *   get:
 *     summary: Get a college by ID
 *     tags: [College]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     responses:
 *       200:
 *         description: College details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/College'
 *       404:
 *         description: College not found
 */
adminColledgeRouter.get('/:id', auditLogger('fetching single colledge by id'), validateObjectId(objectIdValidation),getCollegeById);
publicColledgeRouter.get('/:id', auditLogger('fetching single colledge by id'), validateObjectId(objectIdValidation),getCollegeById);

/**
 * @swagger
 * /college/{id}:
 *   patch:
 *     summary: Update a college
 *     tags: [College]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/editColleges'
 *     responses:
 *       200:
 *         description: College updated
 *       404:
 *         description: College not found
 */
adminColledgeRouter.patch('/:id', auditLogger('editing colledge collection'), validateObjectId(objectIdValidation),  validate(editCollegeSchema), updateCollege);

/**
 * @swagger
 * /college/{id}:
 *   delete:
 *     summary: Delete a college
 *     tags: [College]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: College ID
 *     responses:
 *       200:
 *         description: College deleted
 *       404:
 *         description: College not found
 */
adminColledgeRouter.delete('/:id', auditLogger('deleting colledge collection'), validateObjectId(objectIdValidation), deleteColledge);

export { adminColledgeRouter, publicColledgeRouter }