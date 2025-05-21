import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { presidentSchema } from '../../validations/presidentValidation.mjs';

const router = express.Router();

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
router.post('/', validate(presidentSchema), createPresident);

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
router.get('/', getAllPresidents);

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
router.get('/:id', getPresidentById);

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
 *             $ref: '#/components/schemas/Presidents'
 *     responses:
 *       200:
 *         description: President updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Presidents'
 *       404:
 *         description: President not found
 */
router.patch('/:id', validate(presidentSchema), updatePresident);

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
router.delete('/:id', deletePresident);

// Controller stubs

async function createPresident(req, res) {
  try {
    res.status(201).json({ message: 'President created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPresidents(req, res) {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPresidentById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updatePresident(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'President updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePresident(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'President deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
