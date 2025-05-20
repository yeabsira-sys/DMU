import express from 'express'
import { validate } from '../../middlewares/validate.mjs';
import { admissionSchema } from '../../validations/admissionSchema.mjs';
import { auditLogger } from '../../middlewares/auditLoger.mjs';
const router = express.Router()
import {
  createAdmission,
  getAllAdmissions,
  updateAdmission,
  toggleAdmissionStatus,
  exportAdmissionsToExcel
} from '../../controllers/admissionController.mjs';

const authorizeRoles = (role) => {
    return (req,res,next) => {
        if(role !== 'admin') return res.status(401).json({message: 'unauthorized'}) 
            next()
    }
}

/**
 * @swagger
 * tags:
 *   - name: AdmissionProgram
 *     description: Admission Program Management
 */

/**
 * @swagger
 * /admissions:
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

router.post('/', auditLogger('admission post creation'), validate(admissionSchema), createAdmission);

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

router.get('/', getAllAdmissions);
// router.get('/:id', getAdmissionById);

/**
 * @swagger
 * /admissions/{id}:
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

router.patch('/:id', authorizeRoles('admin'), validate(admissionSchema), updateAdmission);

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
 * /admissions/{id}/toggle:
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
router.put('/:id/toggle', authorizeRoles('admin'), toggleAdmissionStatus);


/**
 * @swagger
 * /admissions/export:
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
router.get('/export/excel', authorizeRoles('admin'), exportAdmissionsToExcel);


export default router