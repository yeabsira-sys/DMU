import express from 'express'
import userRoutes from '../routes/userRoutes.mjs'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import { verifyAdmin } from '../middlewares/checkForAdmin.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import  {auditLogRouter}  from '../routes/auditlogsRoute.mjs'
import  {adminNewsRouter}  from '../routes/news/newsRoutes.mjs'
import { adminFileRouter } from '../routes/fileRoute/imagesRoutes.mjs'
import {adminAdmissionRouter} from '../routes/admissions/admissionRoutes.mjs'
import { adminCampusRouter } from '../routes/universityData/campuses.mjs'
import { adminCampusLifeRouter } from '../routes/universityData/campusLife.mjs'
import { adminColledgeRouter } from '../routes/universityData/colledge.mjs'
import { adminDepartmentRouter } from '../routes/universityData/department.mjs'
import { adminSubscribRouter } from '../routes/universityData/newsLetterSubscription.mjs'
import { adminOfficeRouter } from '../routes/universityData/office.mjs'
import { adminPresidentRouter } from '../routes/universityData/presidents.mjs'
import { adminProgramRouter } from '../routes/universityData/programs.mjs'
import { adminSchoolRouter } from '../routes/universityData/schools.mjs'
import { adminStatisticsRouter } from '../routes/universityData/statistics.mjs'
import { adminJobRouter } from '../routes/jops/jopsRoutes.mjs'
import { adminEventRouter } from '../routes/events/eventRoutes.mjs'
import {adminStudentsFileRouter} from '../routes/fileRoute/studentsFile.mjs'

const router = express.Router()
router.use(verifyJWT)
router.use(verifyAdmin)
router.use('/auth/changepassword', changePassword)
router.use('/user', userRoutes)
router.use('/auditlogs',auditLogRouter)
router.use('/file', adminFileRouter)
router.use('/news', adminNewsRouter)
router.use('/admission', adminAdmissionRouter)
router.use('/campuses', adminCampusRouter)
router.use('/campusLife', adminCampusLifeRouter)
router.use('/college', adminColledgeRouter)
router.use('/department', adminDepartmentRouter)
router.use('/subscriber', adminSubscribRouter)
router.use('/offices', adminOfficeRouter)
router.use('/presidents', adminPresidentRouter)
router.use('/programs', adminProgramRouter)
router.use('/schools', adminSchoolRouter)
router.use('/statistics', adminStatisticsRouter)
router.use('/jobs', adminJobRouter)
router.use('/events', adminEventRouter)
router.use('/studentsinfo', adminStudentsFileRouter)




export default router