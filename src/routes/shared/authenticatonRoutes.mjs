import express from 'express'
import {validate} from '../../middlewares/validate.mjs'
import { authSchema } from '../../validations/authSchema.mjs'
import { loginUser } from '../../controllers/loginController.mjs'
import { verifyJWT } from '../../middlewares/jwtVerify.mjs'
import { logout } from '../../controllers/logoutController.mjs'
import { actorLogin } from '../../middlewares/actorlogin.mjs'
import { auditLogger } from '../../middlewares/auditLoger.mjs'

const router = express.Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login with email, phone number, or username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *     responses:
 *       '200':
 *         description: Successfully authenticated
 *       '400':
 *         description: Invalid input or authentication failed
 */
router.post('/login', auditLogger('system login'), validate(authSchema), actorLogin, loginUser )

// logout 
router.get('/logout', auditLogger('system logout'),  logout)

// get logged in user
router.get('/:me', verifyJWT,  (req, res) => {
    res.status(200).send('user')
})

export default router;