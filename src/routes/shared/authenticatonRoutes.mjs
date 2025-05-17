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
 *     summary: Authenticate a user and return a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 609e12a456789abcdeff4321
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       401:
 *         description: Unauthorized - invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 */


router.post('/login', auditLogger('system login'), validate(authSchema), actorLogin, loginUser )

// logout 
router.get('/logout', auditLogger('system logout'),  logout)

// get logged in user
router.get('/:me', verifyJWT,  (req, res) => {
    res.status(200).send('user')
})

export default router;