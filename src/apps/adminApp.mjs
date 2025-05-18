import express from 'express'
import userRoutes from '../routes/userRoutes.mjs'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import { verifyAdmin } from '../middlewares/checkForAdmin.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import  auditlogsRoute  from '../routes/auditlogsRoute.mjs'
import imagesRoutes from '../routes/fileRoute/imagesRoutes.mjs'
import  newsRouter  from '../routes/news/newsRoutes.mjs'

const router = express.Router()
router.use('/auth', authenticatonRoutes)
router.use('/tokenrefresh', refreshTokenRoute)
router.use(verifyJWT)
router.use(verifyAdmin)
router.use('/auth/changepassword', changePassword)
router.use('/user', userRoutes)
router.use('/auditlogs',auditlogsRoute)
router.use('/images', imagesRoutes)
router.use('/news', newsRouter)



export default router