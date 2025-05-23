import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { presidentSchema, editPresidentSchema } from '../../validations/universityDataValidation.mjs';
import { validateObjectId } from '../../middlewares/validateObjectID.mjs'
import { objectIdValidation } from '../../validations/objectIdValidation.mjs'
import { createPresident, getAllPresidents, getPresidentById, updatePresident, deletePresident } from '../../controllers/universityDataController/presidentsController.mjs';

const adminPresidentRouter = express.Router();
const publicPresidentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Presidents
 *     description: Presidents Management
 */

/**
 * @swagger
 * /presidents:
 *   post:
 *     summary: Create a new president
 *     tags: [Presidents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Presidents'
 *     responses:
 *       201:
 *         description: President created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presidents'
 *       400:
 *         description: Validation error
 */
adminPresidentRouter.post('/', validate(presidentSchema), createPresident);

/**
 * @swagger
 * /presidents:
 *   get:
 *     summary: Get all presidents
 *     tags: [Presidents]
 *     responses:
 *       200:
 *         description: List of presidents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Presidents'
 */
adminPresidentRouter.get('/', getAllPresidents);
publicPresidentRouter.get('/', getAllPresidents);

/**
 * @swagger
 * /presidents/{id}:
 *   get:
 *     summary: Get a president by ID
 *     tags: [Presidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: President ID
 *     responses:
 *       200:
 *         description: President details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presidents'
 *       404:
 *         description: President not found
 */
adminPresidentRouter.get('/:id', getPresidentById);
publicPresidentRouter.get('/:id', getPresidentById);

/**
 * @swagger
 * /presidents/{id}:
 *   patch:
 *     summary: Update a president
 *     tags: [Presidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: President ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/editPresidents'
 *     responses:
 *       200:
 *         description: President updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/editPresidents'
 *       404:
 *         description: President not found
 */
adminPresidentRouter.patch('/:id', validate(editPresidentSchema), updatePresident);

/**
 * @swagger
 * /presidents/{id}:
 *   delete:
 *     summary: Delete a president
 *     tags: [Presidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: President ID
 *     responses:
 *       200:
 *         description: President deleted
 *       404:
 *         description: President not found
 */
adminPresidentRouter.delete('/:id', deletePresident);

export {adminPresidentRouter, publicPresidentRouter}