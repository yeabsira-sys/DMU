import express from 'express'
import { verifyJWT } from '../middlewares/jwtVerify.mjs'
import authenticatonRoutes from '../routes/shared/authenticatonRoutes.mjs'
import refreshTokenRoute from '../routes/shared/refreshTokenRoute.mjs'
import changePassword from '../routes/shared/changePassword.mjs'
import imagesRoutes from '../routes/fileRoute/imagesRoutes.mjs'
import  newsRouter  from '../routes/news/newsRoutes.mjs'
import { verifyCDA } from '../middlewares/verifyCDA.mjs'

const router = express.Router()

router.use('/auth', authenticatonRoutes)
router.use('/tokenrefresh', refreshTokenRoute)
router.use(verifyJWT)
router.use(verifyCDA)
router.use('/auth/changepassword', changePassword)
router.use('/images', imagesRoutes)
router.use('/news', newsRouter)


export default router