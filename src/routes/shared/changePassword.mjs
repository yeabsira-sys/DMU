import express from 'express'
import { validate } from '../../middlewares/validate.mjs'
import { passwordChangeSchema } from '../../validations/authSchema.mjs'
import { changePassword } from '../../controllers/changePasswordController.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs'
const router = express.Router()

router.put('/', auditLogger("password change"), validate(passwordChangeSchema), changePassword );
export default router;