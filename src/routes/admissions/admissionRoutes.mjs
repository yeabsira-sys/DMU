import express from 'express'
import { validate } from '../../middlewares/validate.mjs';
import { admissionSchema } from '../../validations/admissionSchema.mjs';
import { auditLogger } from '../../middlewares/auditLoger.mjs';
import {
  createAdmission,
  getAllAdmissions,
  updateAdmission,
  toggleAdmissionStatus,
  exportAdmissionsToExcel
} from '../../controllers/admissionController.mjs';

const adminRouter = express.Router()
const publicRouter = express.Router()
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
 *               $ref: '#/components/schemas/AdmissionProgram'
 *       400:
 *         description: Bad request
 */

adminRouter.post('/', auditLogger('admission post creation'), validate(admissionSchema), createAdmission);

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

publicRouter.get('/', getAllAdmissions);
adminRouter.get('/', getAllAdmissions);
// router.get('/:id', getAdmissionById);

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
 *             $ref: '#/components/schemas/AdmissionProgram'
 *     responses:
 *       200:
 *         description: Admission program updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdmissionProgram'
 *       404:
 *         description: Program not found
 */

adminRouter.patch('/:id', auditLogger('admission programs changes'), validate(admissionSchema), updateAdmission);

/** 
 *@swagger
 *  /admission/delete:{_id}:
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
// router.delete('/:id', authorizeRoles('admin'), deleteAdmission);


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
adminRouter.put('/:id/toggle', toggleAdmissionStatus);


/**
 * @swagger
 * /admission /export:
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
adminRouter.get('/export/excel',exportAdmissionsToExcel);

export  {publicRouter, adminRouter}