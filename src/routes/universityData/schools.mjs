import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { schoolSchema } from '../../validations/schoolValidation.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Schools
 *     description: Schools Management
 */

/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schools'
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schools'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(schoolSchema), createSchool);

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: List of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schools'
 */
router.get('/', getAllSchools);

/**
 * @swagger
 * /schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schools'
 *       404:
 *         description: School not found
 */
router.get('/:id', getSchoolById);

/**
 * @swagger
 * /schools/{id}:
 *   patch:
 *     summary: Update a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schools'
 *     responses:
 *       200:
 *         description: School updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schools'
 *       404:
 *         description: School not found
 */
router.patch('/:id', validate(schoolSchema), updateSchool);

/**
 * @swagger
 * /schools/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted
 *       404:
 *         description: School not found
 */
router.delete('/:id', deleteSchool);

// Controller stubs

async function createSchool(req, res) {
  try {
    res.status(201).json({ message: 'School created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllSchools(req, res) {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSchoolById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateSchool(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'School updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteSchool(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'School deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
