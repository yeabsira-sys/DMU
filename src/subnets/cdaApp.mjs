import express from 'express'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import  {adminNewsRouter}  from '../routes/news/newsRoutes.mjs'
import { verifyCDA } from '../middlewares/verifyCDA.mjs'
import { adminCampusRouter } from '../routes/universityData/campuses.mjs'
import { adminFileRouter } from '../routes/fileRoute/imagesRoutes.mjs'
import {adminAdmissionRouter} from '../routes/admissions/admissionRoutes.mjs'
import { adminEventRouter } from '../routes/events/eventRoutes.mjs'
import { adminJobRouter } from '../routes/jops/jopsRoutes.mjs'
import { adminStudentsFileRouter } from '../routes/fileRoute/studentsFile.mjs'
import { adminDownload } from '../routes/fileRoute/studentsFile.mjs'
import { adminAnnouncementRouter } from '../routes/announcements/announcementRoutes.mjs'
const router = express.Router()

router.use(verifyJWT)
router.use(verifyCDA)
router.use('/auth/changepassword', changePassword)
router.use('/file', adminFileRouter)
router.use('/news', adminNewsRouter)
router.use('/admission', adminAdmissionRouter)
router.use('/campuses', adminCampusRouter)
router.use('/file', adminFileRouter)
router.use('/admission', adminAdmissionRouter)
router.use('/jobs', adminJobRouter)
router.use('/events', adminEventRouter)
router.use('/studentsinfo', adminStudentsFileRouter)
router.use('/', adminDownload)
router.use('/announcements', adminAnnouncementRouter)
export default router