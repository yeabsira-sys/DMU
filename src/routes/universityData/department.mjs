import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { departmentSchema } from '../../validations/departmentValidation.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Department
 *     description: Department Management
 */

/**
 * @swagger
 * /department:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(departmentSchema), createDepartment);

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 */
router.get('/', getAllDepartments);

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
router.get('/:id', getDepartmentById);

/**
 * @swagger
 * /department/{id}:
 *   patch:
 *     summary: Update a department
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Department updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
router.patch('/:id', validate(departmentSchema), updateDepartment);

/**
 * @swagger
 * /department/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted
 *       404:
 *         description: Department not found
 */
router.delete('/:id', deleteDepartment);

// Controller stubs

async function createDepartment(req, res) {
  try {
    res.status(201).json({ message: 'Department created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllDepartments(req, res) {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Department updated', id, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: 'Department deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
