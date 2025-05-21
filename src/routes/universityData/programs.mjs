import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { programSchema } from '../../validations/programValidation.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Programs
 *     description: Programs Management
 */

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Programs'
 *     responses:
 *       201:
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Programs'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(programSchema), createProgram);

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: List of programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Programs'
 */
router.get('/', getAllPrograms);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get a program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Programs'
 *       404:
 *         description: Program not found
 */
router.get('/:id', getProgramById);

/**
 * @swagger
 * /programs/{id}:
 *   patch:
 *     summary: Update a program
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Programs'
 *     responses:
 *       200:
 *         description: Program updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Programs'
 *       404:
 *         description: Program not found
 */
router.patch('/:id', validate(programSchema), updateProgram);

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program deleted
 *       404:
 *         description: Program not found
 */
router.delete('/:id', deleteProgram);

// Controller stubs

async function createProgram(req, res) {
  try {
    res.status(201).json({ message: 'Program created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPrograms(req, res) {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProgramById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProgram(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Program updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProgram(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Program deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
