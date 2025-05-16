import express from 'express'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'

const router = express.Router()

router.use('/auth', authenticatonRoutes)



export default router