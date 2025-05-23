import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { officeSchema, editOfficeSchema } from '../../validations/universityDataValidation.mjs';
import { createOffice, getAllOffices, getOfficeById, updateOffice, deleteOffice } from '../../controllers/universityDataController/officeController.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs' 
import { validateObjectId } from '../../middlewares/validateObjectID.mjs'
import { objectIdValidation } from '../../validations/objectIdValidation.mjs'

const adminOfficeRouter = express.Router();
const publicOfficeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Office
 *     description: Office Management
 */

/**
 * @swagger
 * /offices:
 *   post:
 *     summary: Create a new office
 *     tags: [Office]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Office'
 *     responses:
 *       201:
 *         description: Office created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Office'
 *       400:
 *         description: Validation error
 */
adminOfficeRouter.post('/', auditLogger('creating office'), validate(officeSchema), createOffice);

/**
 * @swagger
 * /offices:
 *   get:
 *     summary: Get all offices
 *     tags: [Office]
 *     responses:
 *       200:
 *         description: List of offices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Office'
 */
adminOfficeRouter.get('/', getAllOffices);

/**
 * @swagger
 * /offices/{id}:
 *   get:
 *     summary: Get an office by ID
 *     tags: [Office]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     responses:
 *       200:
 *         description: Office details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Office'
 *       404:
 *         description: Office not found
 */
adminOfficeRouter.get('/:id', getOfficeById);

/**
 * @swagger
 * /offices/{id}:
 *   patch:
 *     summary: Update an office
 *     tags: [Office]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Office'
 *     responses:
 *       200:
 *         description: Office updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Office'
 *       404:
 *         description: Office not found
 */
adminOfficeRouter.patch('/:id', auditLogger('updating office record'), validate(editOfficeSchema), updateOffice);

/**
 * @swagger
 * /offices/{id}:
 *   delete:
 *     summary: Delete an office
 *     tags: [Office]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     responses:
 *       200:
 *         description: Office deleted
 *       404:
 *         description: Office not found
 */
adminOfficeRouter.delete('/:id', deleteOffice);


export { adminOfficeRouter, publicOfficeRouter}