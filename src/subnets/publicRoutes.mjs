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

const router = express.Router()

router.use('/auth', authenticatonRoutes)
router.use('/auth/recovery', forgetPassword)
router.use('/auth/tokenrefresh', refreshTokenRoute)
router.use('/news', publicNewsRouter)
router.use('/admission', publicAdmissionRouter)
router.use('/file', publicFileRouter)
router.use('/campuses', publicCampusRouter)
router.use('/campusLife', publicCampusLifeRouter)
router.use('/college', publicColledgeRouter)


export default router