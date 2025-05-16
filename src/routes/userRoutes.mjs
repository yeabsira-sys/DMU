import express from "express";
import { validate } from "../middlewares/validate.mjs";
import { activateUser, createUser, suspendUser, updateUser } from "../controllers/userController.mjs";
import { createUserSchema, updateUserSchema, suspendUserSchema } from "../validations/userSchema.mjs";
import { verifyAdmin } from "../middlewares/checkForAdmin.mjs";
import { auditLogger } from "../middlewares/auditLoger.mjs";
import { getUserController } from '../controllers/getUserController.mjs'
import { getSingleUserByID, getSingleUserByEmail, getSingleUserByPhone, getSingleUserByUserName } from "../controllers/getSingleUser.mjs";
import { deleteUserController } from "../controllers/deleteUserController.mjs";
import { deleteUserSchema} from '../validations/deleteUserSchema.mjs'


const router = express.Router();
router.use(verifyAdmin)

//search for user USED TO FILTER USER

router.get('/search', auditLogger('search for users'), getUserController)
//create user
// this is boiler plate for core implementation
router.post('/', auditLogger('user creation'), validate(createUserSchema), createUser);

// get user by id
router.get('/id/:id', auditLogger('get selective user'), getSingleUserByID)
// get user by email
router.get('/email/:email', auditLogger('get selective user'), getSingleUserByEmail)
router.get('/phone/:phone', auditLogger('get selective user'), getSingleUserByPhone)
router.get('/username/:username', auditLogger('get selective user'), getSingleUserByUserName)
//update user
router.patch('/update', auditLogger('update user'), validate(updateUserSchema), updateUser)

router.put('/suspend', auditLogger('user suspend'), validate(suspendUserSchema), suspendUser)

router.put('/activate', auditLogger('user activation'), validate(suspendUserSchema), activateUser)


//delete user
router.delete('/', validate(deleteUserSchema), auditLogger('delete user'), deleteUserController)

export default router;