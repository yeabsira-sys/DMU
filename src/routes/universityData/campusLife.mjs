import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { campusLifeSchema } from '../../validations/campusLifeValidation.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: CampusLife
 *     description: Campus Life Management
 */

/**
 * @swagger
 * /campus-life:
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
router.post('/', validate(campusLifeSchema), createCampusLife);

/**
 * @swagger
 * /campus-life:
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
router.get('/', getAllCampusLife);

/**
 * @swagger
 * /campus-life/{id}:
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
router.get('/:id', getCampusLifeById);

/**
 * @swagger
 * /campus-life/{id}:
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
 *             $ref: '#/components/schemas/CampusLife'
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
router.patch('/:id', validate(campusLifeSchema), updateCampusLife);

/**
 * @swagger
 * /campus-life/{id}:
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
router.delete('/:id', deleteCampusLife);

// Controller stubs

async function createCampusLife(req, res) {
  try {
    res.status(201).json({ message: 'Campus life created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllCampusLife(req, res) {
  try {
    res.status(200).json([]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCampusLifeById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCampusLife(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Campus life updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCampusLife(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Campus life deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
