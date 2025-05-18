import express from 'express'
import { refreshToken } from '../../controllers/refreshTokenController.mjs'
 

const router = express.Router()

/**
 * @swagger
 * /auth/refreshtoken:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: refresh to log in if access token expired
 * 
 *     responses:
 *       '200':
 *         description: new access token returned 
 *       '400':
 *         description: prompted to login again refresher token expired
 */
router.get('/', refreshToken )

export default router