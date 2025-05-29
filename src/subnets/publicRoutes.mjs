import express from 'express'
import  {publicNewsRouter}  from '../routes/news/newsRoutes.mjs'
import {publicAdmissionRouter} from '../routes/admissions/admissionRoutes.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import forgetPassword from '../routes/shared/forgetPassword.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import { publicFileRouter } from '../routes/fileRoute/imagesRoutes.mjs'
import { publicCampusLifeRouter } from '../routes/universityData/campusLife.mjs'
import { publicCampusRouter } from '../routes/universityData/campuses.mjs'
import { publicColledgeRouter } from '../routes/universityData/colledge.mjs'
import { publicDeparmentRouter } from '../routes/universityData/department.mjs'
import { publicSubscribRouter } from '../routes/universityData/newsLetterSubscription.mjs'
import { publicOfficeRouter } from '../routes/universityData/office.mjs'
import { publicPresidentRouter } from '../routes/universityData/presidents.mjs'
import { publicProgramRouter } from '../routes/universityData/programs.mjs'
import { publicSchoolRout } from '../routes/universityData/schools.mjs'
import { publicStatisticsRouter } from '../routes/universityData/statistics.mjs'
import { publicJobRouter } from '../routes/jops/jopsRoutes.mjs'
import { publicEventRouter } from '../routes/events/eventRoutes.mjs'
import {publicDownload, publicStudentsFileRouter} from '../routes/fileRoute/studentsFile.mjs'
import { publicAnnouncementRouter } from '../routes/announcements/announcementRoutes.mjs'
import session from 'express-session'
import passport from 'passport'
import googleAuth from '../google/googleAuth.mjs'
import googleRoutes from  '../routes/googleRoutes.mjs'
import '../google/passport.mjs'
// (async () => await import('../config/passport.mjs'))

const router = express.Router()

router.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

router.use('/googleAuth', googleAuth);
router.use('/google', googleRoutes);

router.use('/auth', authenticatonRoutes)
router.use('/auth/recovery', forgetPassword)
router.use('/auth/tokenrefresh', refreshTokenRoute)
router.use('/news', publicNewsRouter)
router.use('/admission', publicAdmissionRouter)
router.use('/file', publicFileRouter)
router.use('/campuses', publicCampusRouter)
router.use('/campusLife', publicCampusLifeRouter)
router.use('/college', publicColledgeRouter)
router.use('/department', publicDeparmentRouter)
router.use('/subscription', publicSubscribRouter)
router.use('/offices', publicOfficeRouter)
router.use('/presidents', publicPresidentRouter)    
router.use('/programs', publicProgramRouter)
router.use('/schools', publicSchoolRout)
router.use('/statistics', publicStatisticsRouter)
router.use('/jobs', publicJobRouter)
router.use('/events', publicEventRouter)
router.use('/announcements', publicAnnouncementRouter)
router.use('/studentsinfo', publicStudentsFileRouter)
router.use('/', publicDownload)

export default router