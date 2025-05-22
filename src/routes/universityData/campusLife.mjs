import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { campusLifeSchema, editCampusLifeSchema } from '../../validations/universityDataValidation.mjs';
import { auditLogger } from '../../middlewares/auditLoger.mjs';
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';
import { validateObjectId } from '../../middlewares/validateObjectID.mjs';
import { createCampusLife, getAllCampusLife, getCampusLifeById, updateCampusLife, deleteCampuLife } from '../../controllers/universityDataController/campusLifeController.mjs';

const adminCampusLifeRouter = express.Router();
const publicCampusLifeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: CampusLife
 *     description: Campus Life Management
 */

/**
 * @swagger
 * /campusLife:
 *   post:
 *     summary: Create a new campus life entry
 *     tags: [CampusLife]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampusLife'
 *     responses:
 *       201:
 *         description: Campus life created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampusLife'
 *       400:
 *         description: Validation error
 */
adminCampusLifeRouter.post('/', auditLogger('creating campus life post'),  validate(campusLifeSchema), createCampusLife);

/**
 * @swagger
 * /campusLife:
 *   get:
 *     summary: Get all campus life entries
 *     tags: [CampusLife]
 *     responses:
 *       200:
 *         description: List of campus life entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CampusLife'
 */
adminCampusLifeRouter.get('/', auditLogger('fetching all campus life posts'), getAllCampusLife);
publicCampusLifeRouter.get('/', getAllCampusLife);

/**
 * @swagger
 * /campusLife/{id}:
 *   get:
 *     summary: Get a campus life entry by ID
 *     tags: [CampusLife]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus life ID
 *     responses:
 *       200:
 *         description: Campus life details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampusLife'
 *       404:
 *         description: Campus life entry not found
 */
adminCampusLifeRouter.get('/:id', auditLogger('fetching single campus life post'), validateObjectId(objectIdValidation),  getCampusLifeById);
publicCampusLifeRouter.get('/:id', getCampusLifeById);

/**
 * @swagger
 * /campusLife/{id}:
 *   patch:
 *     summary: Update a campus life entry
 *     tags: [CampusLife]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus life ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateCampusLife'
 *     responses:
 *       200:
 *         description: Campus life updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CampusLife'
 *       404:
 *         description: Campus life entry not found
 */
adminCampusLifeRouter.patch('/:id', auditLogger('updating campus life post'), validateObjectId(objectIdValidation), validate(editCampusLifeSchema), updateCampusLife);

/**
 * @swagger
 * /campusLife/{id}:
 *   delete:
 *     summary: Delete a campus life entry
 *     tags: [CampusLife]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus life ID
 *     responses:
 *       200:
 *         description: Campus life deleted
 *       404:
 *         description: Campus life entry not found
 */
adminCampusLifeRouter.delete('/:id', auditLogger('deleting single campus life record/post'), validateObjectId(objectIdValidation), deleteCampuLife)


export { adminCampusLifeRouter, publicCampusLifeRouter}