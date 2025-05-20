import express from 'express'
import  {publicNewsRouter}  from '../routes/news/newsRoutes.mjs'
import {publicRouter} from '../routes/admissions/admissionRoutes.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import forgetPassword from '../routes/shared/forgetPassword.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import { publicFileRouter } from '../routes/fileRoute/imagesRoutes.mjs'

const router = express.Router()

export default router
router.use('/auth', authenticatonRoutes)
router.use('/auth/recovery', forgetPassword)
router.use('/auth/tokenrefresh', refreshTokenRoute)
router.use('/news', publicNewsRouter)
router.use('/admission', publicRouter)
router.use('file', publicFileRouter)