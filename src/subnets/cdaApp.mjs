import express from 'express'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import imagesRoutes from '../routes/fileRoute/imagesRoutes.mjs'
import  newsRouter  from '../routes/news/newsRoutes.mjs'
import { verifyCDA } from '../middlewares/verifyCDA.mjs'
import admissionRoutes from '../routes/admissions/admissionRoutes.mjs'
import forgetPassword from '../routes/shared/forgetPassword.mjs'

const router = express.Router()

router.use('/auth', authenticatonRoutes)
router.use('/auth', forgetPassword)
router.use('/tokenrefresh', refreshTokenRoute)
router.use(verifyJWT)
router.use(verifyCDA)
router.use('/auth/changepassword', changePassword)
router.use('/images', imagesRoutes)
router.use('/news', newsRouter)
router.use('/admission', admissionRoutes)


export default router