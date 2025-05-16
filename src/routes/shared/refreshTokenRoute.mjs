import express from 'express'
import { refreshToken } from '../../controllers/refreshTokenController.mjs'
 

const router = express.Router()

router.get('/', refreshToken )

export default router