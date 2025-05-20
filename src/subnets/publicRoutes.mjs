import express from 'express'
import  newsRouter  from '../routes/news/newsRoutes.mjs'
import admissionRoutes from '../routes/admissions/admissionRoutes.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import forgetPassword from '../routes/shared/forgetPassword.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
const router = express.Router()

export default router
router.use('/auth', authenticatonRoutes)
router.use('/auth/recovery', forgetPassword)
router.use('/auth/tokenrefresh', refreshTokenRoute)
router.use('/news', newsRouter)
router.use('/admission', admissionRoutes)