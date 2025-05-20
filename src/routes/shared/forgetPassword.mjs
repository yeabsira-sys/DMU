import express from 'express'
import { passwordChangeSchema } from '../../validations/authSchema.mjs'
import { validate } from '../../middlewares/validate.mjs'
import { requestPasswordRecovery } from '../../controllers/passwordRecovery.mjs'
import { verifyResetCode } from '../../controllers/verifyAndRecover.mjs'

const router = express.Router()


/**
 * @swagger
 * /auth/recovery/forgot-password:
 *   put:
 *     tags:
 *       - Password Recovery
 *     summary: Password Recovery
 *     description: Sends a recovery code to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Recovery code sent via email
 *       400:
 *         description: Invalid input or user cannot be found
 *       500:
 *         description: Internal server error
 */

 

router.put('/forgot-password', validate(passwordChangeSchema), requestPasswordRecovery )

/**
 * @swagger
 * /auth/recovery/change-password:
 *   put:
 *     tags:
 *       - Password Recovery
 *     summary: password Recovery
 *     description: Allows users to change their password using email or userName and a verification code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordRecovery'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or passwords do not match
 *       401:
 *         description: Verification code is invalid or expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put('/change-password', validate(passwordChangeSchema), verifyResetCode )

export default router;