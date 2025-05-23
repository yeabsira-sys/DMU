import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { subscriberValidationSchema, searchSubscriberSchema } from '../../validations/subscriberSchema.mjs';
import { createSubscriber, getAllSubscriber, getSubscriberByEmail, toggleSubscriber } from '../../controllers/subscriberController.mjs';


const adminSubscribRouter = express.Router();
const publicSubscribRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: subscription
 *     description: news later subscription Management
 */

/**
 * @swagger
 * /subscription:
 *   post:
 *     summary: Create a new newsletter
 *     tags: [subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jj@gmail.com
 *     responses:
 *       201:
 *         description: Newsletter created successfully
 *       400:
 *         description: Validation error
 */

publicSubscribRouter.post('/', validate(subscriberValidationSchema), createSubscriber);
/**
 * @swagger
 * /subscription:
 *   put:
 *     summary: Toggle Subscription
 *     tags: [subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jj@gmail.com
 *     responses:
 *       201:
 *         description: activate and inactive news later and announcement notification
 *       400:
 *         description: Validation error
 */

publicSubscribRouter.put('/', validate(subscriberValidationSchema), toggleSubscriber);
/**
 * @swagger
 * /subscriber:
 *   get:
 *     summary: Get all newsletters
 *     tags: [subscription]
 *     parameters: 
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit of the newsletter subscribers to be fetched
 *       - in: query
 *         name: page
 *         schema: 
 *           type: number
 *         description: Page number to be fetched 
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by subscription status
 *     responses:
 *       200:
 *         description: List of subscribers
 */

adminSubscribRouter.get('/', getAllSubscriber);

/**
 * @swagger
 * /subscriber/{email}:
 *   get:
 *     summary: Get a news later subscriber by email
 *     tags: [subscription]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: subscriber email
 *     responses:
 *       200:
 *         description: subscriptions status
 *       404:
 *         description: Newsletter not found
 */
adminSubscribRouter.get('/:email', getSubscriberByEmail);

export {adminSubscribRouter, publicSubscribRouter}


