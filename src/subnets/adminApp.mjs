import express from 'express'
import userRoutes from '../routes/userRoutes.mjs'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import { verifyAdmin } from '../middlewares/checkForAdmin.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import  auditlogsRoute  from '../routes/auditlogsRoute.mjs'
import  {adminNewsRouter}  from '../routes/news/newsRoutes.mjs'
import { adminFileRouter } from '../routes/fileRoute/imagesRoutes.mjs'
import {adminAdmissionRouter} from '../routes/admissions/admissionRoutes.mjs'
import { adminCampusRouter } from '../routes/universityData/campuses.mjs'
import { adminCampusLifeRouter } from '../routes/universityData/campusLife.mjs'
import { adminColledgeRouter } from '../routes/universityData/colledge.mjs'
import { adminDepartmentRouter } from '../routes/universityData/department.mjs'


const router = express.Router()
router.use(verifyJWT)
router.use(verifyAdmin)
router.use('/auth/changepassword', changePassword)
router.use('/user', userRoutes)
router.use('/auditlogs',auditlogsRoute)
router.use('/file', adminFileRouter)
router.use('/news', adminNewsRouter)
router.use('/admission', adminAdmissionRouter)
router.use('/campuses', adminCampusRouter)
router.use('/campusLife', adminCampusLifeRouter)
router.use('/college', adminColledgeRouter)
router.use('/department', adminDepartmentRouter)




export default router