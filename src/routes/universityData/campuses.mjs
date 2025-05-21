import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { campusSchema, editCampusSchema } from '../../validations/universityDataValidation.mjs';
import { createCampus, getAllCampuses, getCampusById, updateCampus, deleteCampus } from '../../controllers/universityDataController/campusesController.mjs';
const adminCampusRouter = express.Router();
const publicCampusRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Campuses
 *     description: Campuses Management
 */

/**
 * @swagger
 * /campuses:
 *   post:
 *     summary: Create a new campus
 *     tags: [Campuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campuses'
 *     responses:
 *       201:
 *         description: Campus created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campuses'
 *       400:
 *         description: Validation error
 */
adminCampusRouter.post('/', validate(campusSchema), createCampus);

/**
 * @swagger
 * /campuses:
 *   get:
 *     summary: Get all campuses
 *     tags: [Campuses]
 *     responses:
 *       200:
 *         description: List of campuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campuses'
 */
adminCampusRouter.get('/', getAllCampuses);
publicCampusRouter.get('/', getAllCampuses);

/**
 * @swagger
 * /campuses/{id}:
 *   get:
 *     summary: Get a campus by ID
 *     tags: [Campuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus ID
 *     responses:
 *       200:
 *         description: Campus details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campuses'
 *       404:
 *         description: Campus not found
 */
adminCampusRouter.get('/:id', getCampusById);
publicCampusRouter.get('/:id', getCampusById);

/**
 * @swagger
 * /campuses/{id}:
 *   patch:
 *     summary: Update a campus
 *     tags: [Campuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateCampus'
 *     responses:
 *       200:
 *         description: Campus updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campuses'
 *       404:
 *         description: Campus not found
 */
adminCampusRouter.patch('/:id', validate(editCampusSchema), updateCampus);

/**
 * @swagger
 * /campuses/{id}:
 *   delete:
 *     summary: Delete a campus
 *     tags: [Campuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus ID
 *     responses:
 * 
 *       200:
 *         description: Campus deleted
 *       404:
 *         description: Campus not found
 */
adminCampusRouter.delete('/:id', deleteCampus);

export { adminCampusRouter, publicCampusRouter}

