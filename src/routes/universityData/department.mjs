import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { departmentSchema, editDepartmentSchema } from '../../validations/universityDataValidation.mjs'
import { validateObjectId } from '../../middlewares/validateObjectID.mjs'
import { objectIdValidation } from '../../validations/objectIdValidation.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs'
import { createDepartment, getAllDepartments, getDepartmentById, deleteDepartment, updateDepartment } from '../../controllers/universityDataController/departmentsController.mjs'

const adminDepartmentRouter = express.Router();
const publicDeparmentRouter = express.Router();

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
adminDepartmentRouter.post('/', auditLogger('creating department'), validate(departmentSchema), createDepartment);

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
adminDepartmentRouter.get('/', auditLogger('fetching deparements'),  getAllDepartments);
publicDeparmentRouter.get('/', getAllDepartments);

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
adminDepartmentRouter.get('/:id', auditLogger('fetching department by id'), validateObjectId(objectIdValidation),getDepartmentById);
publicDeparmentRouter.get('/:id', validateObjectId(objectIdValidation),getDepartmentById);

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
 *             $ref: '#/components/schemas/editDepartment'
 *     responses:
 *       200:
 *         description: Department updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/editDepartment'
 *       404:
 *         description: Department not found
 */
adminDepartmentRouter.patch('/:id', auditLogger('updating department'), validateObjectId(objectIdValidation), validate(editDepartmentSchema), updateDepartment);

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
adminDepartmentRouter.delete('/:id', auditLogger('deleting department '), validateObjectId(objectIdValidation), deleteDepartment);


export { adminDepartmentRouter, publicDeparmentRouter};