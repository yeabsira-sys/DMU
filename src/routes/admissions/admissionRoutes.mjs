import express from 'express'
import { validate } from '../../middlewares/validate.mjs';
import { admissionSchema, editAdmissionSchema } from '../../validations/admissionSchema.mjs';
import { auditLogger } from '../../middlewares/auditLoger.mjs';
import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  toggleAdmissionStatus,
  exportAdmissionsToExcel,
  deleteAdmission
} from '../../controllers/admissionController.mjs';
import { validateObjectId } from '../../middlewares/validateObjectID.mjs';
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';
const adminAdmissionRouter = express.Router()
const publicAdmissionRouter = express.Router()
/**
 * @swagger
 * tags:
 *   - name: AdmissionProgram
 *     description: Admission Program Management
 */

/**
 * @swagger
 * /admission:
 *   post:
 *     summary: Create a new admission program
 *     tags: [AdmissionProgram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdmissionProgram'
 *     responses:
 *       201:
 *         description: Admission program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdmissionProgramResponse'
 *       400:
 *         description: Bad request
 */

adminAdmissionRouter.post('/', auditLogger('admission post creation'), validate(admissionSchema), createAdmission);

/**
 * @swagger
 * /admission:
 *   get:
 *     summary: Get all admission programs
 *     tags: [AdmissionProgram]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: degreeLevel
 *         schema:
 *           type: string
 *         description: Filter by degree level
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Filter by keyWords
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by departments
 *       - in: query
 *         name: modeOfStudy
 *         schema:
 *           type: string
 *         description: Filter by modeOfStudy
 *       - in: query
 *         name: campusLocation
 *         schema:
 *           type: string
 *         description: Filter by campusLocation
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: limit response data
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: get countinous response
 *     responses:
 *       200:
 *         description: List of admission programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdmissionProgram'
 */


/**
 * @swagger
 * /admission/{id}:
 *   get:
 *     summary: Get detailed admission program
 *     tags:
 *       - AdmissionProgram
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Get a single admission program by ID
 *     responses:
 *       200:
 *         description: Admission program detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdmissionProgram'
 */

publicAdmissionRouter.get('/', getAllAdmissions);
adminAdmissionRouter.get('/', getAllAdmissions);

 publicAdmissionRouter.get('/:_id', validateObjectId(objectIdValidation), getAdmissionById);
 adminAdmissionRouter.get('/:_id',validateObjectId(objectIdValidation), getAdmissionById);

/**
 * @swagger
 * /admission/{id}:
 *   patch:
 *     summary: Update an existing admission program
 *     tags: [AdmissionProgram]
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
 *             $ref: '#/components/schemas/EditAdmissionProgram'
 *     responses:
 *       200:
 *         description: Admission program updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdmissionProgramResponse'
 *       404:
 *         description: Program not found
 */

adminAdmissionRouter.patch('/:_id',validateObjectId(objectIdValidation), auditLogger('admission programs changes'), validate(editAdmissionSchema), updateAdmission);

/** 
 *@swagger
 *  /admission/{id}:
 *   delete:
 *     summary: Soft-delete an admission program
 *     tags: [AdmissionProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admission program soft-deleted
 */
adminAdmissionRouter.delete('/:_id',validateObjectId(objectIdValidation), deleteAdmission);

/**
 * @swagger
 * /admission/{id}/toggle:
 *   put:
 *     summary: Toggle the isActive status of an admission program
 *     tags: [AdmissionProgram]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toggled isActive status
 */
adminAdmissionRouter.put('/:_id/toggle',  validateObjectId(objectIdValidation), toggleAdmissionStatus);


/**
 * @swagger
 * /admission/export/excel:
 *   get:
 *     summary: Export admissions to CSV or Excel
 *     tags: [AdmissionProgram]
 *     parameters:
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *     responses:
 *       200:
 *         description: Exported file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
adminAdmissionRouter.get('/export/excel',exportAdmissionsToExcel);

export  {adminAdmissionRouter, publicAdmissionRouter}