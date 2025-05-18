import express from 'express'
import { validate } from '../../middlewares/validate.mjs'
import { passwordChangeSchema } from '../../validations/authSchema.mjs'
import { changePassword } from '../../controllers/changePasswordController.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs'
const router = express.Router()


/**
 * @swagger
 * /auth/changepassword:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Reset user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Validation error or password mismatch
 */

router.put('/', auditLogger("password change"), validate(passwordChangeSchema), changePassword );
export default router;