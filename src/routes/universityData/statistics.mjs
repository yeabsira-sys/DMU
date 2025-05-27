import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { statisticsSchema, editStatisticsSchema } from '../../validations/universityDataValidation.mjs';
import {
  createStatistic,
  getAllStatistics,
  getStatisticById,
  updateStatistic,
  deleteStatistic,
} from '../../controllers/universityDataController/statisticsController.mjs';
import { auditLogger } from '../../middlewares/auditLoger.mjs';
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';

const adminStatisticsRouter = express.Router();
const publicStatisticsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: Statistics Management
 */

/**
 * @swagger
 * /statistics:
 *   post:
 *     summary: Create a new statistic
 *     tags: [Statistics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Statistics'
 *     responses:
 *       201:
 *         description: Statistic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       400:
 *         description: Validation error
 */
adminStatisticsRouter.post('/', validate(statisticsSchema), createStatistic);

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Get all statistics
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: List of statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Statistics'
 */
adminStatisticsRouter.get('/', getAllStatistics);
publicStatisticsRouter.get('/', getAllStatistics);

/**
 * @swagger
 * /statistics/{id}:
 *   get:
 *     summary: Get a statistic by ID
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Statistic ID
 *     responses:
 *       200:
 *         description: Statistic details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       404:
 *         description: Statistic not found
 */
adminStatisticsRouter.get('/:id', getStatisticById);
publicStatisticsRouter.get('/:id', getStatisticById);

/**
 * @swagger
 * /statistics/{id}:
 *   patch:
 *     summary: Update a statistic
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Statistic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Statistics'
 *     responses:
 *       200:
 *         description: Statistic updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       404:
 *         description: Statistic not found
 */
adminStatisticsRouter.patch('/:id', validate(statisticsSchema), updateStatistic);

/**
 * @swagger
 * /statistics/{id}:
 *   delete:
 *     summary: Delete a statistic
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Statistic ID
 *     responses:
 *       200:
 *         description: Statistic deleted
 *       404:
 *         description: Statistic not found
 */
adminStatisticsRouter.delete('/:id', deleteStatistic);


export { adminStatisticsRouter, publicStatisticsRouter };