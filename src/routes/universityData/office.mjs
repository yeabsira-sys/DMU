import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { officeSchema } from '../../validations/officeValidation.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Office
 *     description: Office Management
 */

/**
 * @swagger
 * /office:
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
router.post('/', validate(officeSchema), createOffice);

/**
 * @swagger
 * /office:
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
router.get('/', getAllOffices);

/**
 * @swagger
 * /office/{id}:
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
router.get('/:id', getOfficeById);

/**
 * @swagger
 * /office/{id}:
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
router.patch('/:id', validate(officeSchema), updateOffice);

/**
 * @swagger
 * /office/{id}:
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
router.delete('/:id', deleteOffice);

// Controller stubs

async function createOffice(req, res) {
  try {
    res.status(201).json({ message: 'Office created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllOffices(req, res) {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getOfficeById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateOffice(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Office updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteOffice(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Office deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
