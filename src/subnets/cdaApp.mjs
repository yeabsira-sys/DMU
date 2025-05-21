import express from 'express'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import {adminFileRouter} from '../routes/fileRoute/imagesRoutes.mjs'
import  {adminNewsRouter}  from '../routes/news/newsRoutes.mjs'
import { verifyCDA } from '../middlewares/verifyCDA.mjs'
import {adminAdmissionRouter} from '../routes/admissions/admissionRoutes.mjs'
import { adminCampusRouter } from '../routes/universityData/campuses.mjs'

const router = express.Router()

router.use(verifyJWT)
router.use(verifyCDA)
router.use('/auth/changepassword', changePassword)
router.use('/file', adminFileRouter)
router.use('/news', adminNewsRouter)
router.use('/admission', adminAdmissionRouter)
router.use('/campuses', adminCampusRouter)


export default router