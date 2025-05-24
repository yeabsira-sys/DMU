import express from 'express';
import { validate } from '../../middlewares/validate.mjs';
import { editProgramSchema, programSchema, programFilterSchema } from '../../validations/universityDataValidation.mjs';
import { validateObjectId  } from '../../middlewares/validateObjectID.mjs';
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';
import { createProgram, getAllPrograms, getProgramById, updateProgram,deleteProgram, searchProgram, filterPrograms  } from '../../controllers/universityDataController/programsController.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs';

const adminProgramRouter = express.Router();
const publicProgramRouter = express.Router();

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
adminProgramRouter.post('/', auditLogger('creating programs'), validate(programSchema), createProgram);

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
adminProgramRouter.get('/', auditLogger('fetching programs'), getAllPrograms);
publicProgramRouter.get('/', getAllPrograms);
/**
 * @swagger
 * /programs/search:
 *   get:
 *     summary: Search programs by name, type, department,for admin and naive users
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: searchValue
 *         required: false
 *         schema:
 *           type: string
 *         description: Program text search
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *         description: Page number for pagination
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
adminProgramRouter.get('/search', auditLogger('fetching programs'), searchProgram);
publicProgramRouter.get('/search', auditLogger('fetching programs'), searchProgram);


/**
 * @swagger
 * /programs/filterPrograms:
 *   get:
 *     summary: Search programs by name, type, department, isHidden for Admin and CDA only
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Program name
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: Program type
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *         description: Program department
 *       - in: query
 *         name: isHidden
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Program isHidden
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer 
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *         enum: [asc, desc]
 *         description: Sort order (ascending or descending)
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
adminProgramRouter.get('/filterPrograms', auditLogger('fetching programs',), validate(programFilterSchema), filterPrograms);

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
adminProgramRouter.get('/:id', auditLogger('fetching program detail by id'), validateObjectId(objectIdValidation), getProgramById);
publicProgramRouter.get('/:id', getProgramById);

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
adminProgramRouter.patch('/:id', auditLogger('updating progras'), validateObjectId(objectIdValidation), validate(editProgramSchema), updateProgram);

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
adminProgramRouter.delete('/:id', deleteProgram);

export { adminProgramRouter, publicProgramRouter}