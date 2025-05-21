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
// router.use(verifyAdmin)

//search for user USED TO FILTER USER

/**
 * @swagger
 * /user/search:
 *   get:
 *     tags:
 *       - User
 *     summary: Search and filter users
 *     description: Filter and paginate user entries based on various criteria
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Get single user by ObjectID
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (regex search)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter by phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, suspended]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Filtered user results
 */

router.get('/search', auditLogger('search for users'), getUserController)
//create user
// this is boiler plate for core implementation

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

router.post('/', auditLogger('user creation'), validate(createUserSchema), createUser);

// get user by id
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User found successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: User not found
 */

router.get('/id/:id', auditLogger('get selective user'), getSingleUserByID)
// get user by email

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details by email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *     responses:
 *       200:
 *         description: User found and returned successfully
 *       400:
 *         description: Invalid email supplied
 *       404:
 *         description: User not found
 */

router.get('/email/:email', auditLogger('get selective user'), getSingleUserByEmail)

/**
 * @swagger
 * /user/phone/{phone}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details by phone number
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *     responses:
 *       200:
 *         description: User found and returned successfully
 *       400:
 *         description: Invalid phone number supplied
 *       404:
 *         description: User not found
 */

router.get('/phone/:phone', auditLogger('get selective user'), getSingleUserByPhone)

/**
 * @swagger
 * /user/username/{username}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *     responses:
 *       200:
 *         description: User found and returned successfully
 *       400:
 *         description: Invalid username supplied
 *       404:
 *         description: User not found
 */

router.get('/username/:username', auditLogger('get selective user'), getSingleUserByUserName)
//update user

/**
 * @swagger
 * /user/update:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update user details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */

router.patch('/update', auditLogger('update user'), validate(updateUserSchema), updateUser)


/**
 * @swagger
 * /user/suspend:
 *   put:
 *     tags:
 *       - User
 *     summary: Suspend a user by identifier (email, phone, or username)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/suspendUser'
 *     responses:
 *       200:
 *         description: User successfully suspended
 *       400:
 *         description: Invalid identifier format
 *       404:
 *         description: User not found
 */

router.put('/suspend', auditLogger('user suspend'), validate(suspendUserSchema), suspendUser)


/**
 * @swagger
 * /user/activate:
 *   put:
 *     tags:
 *       - User
 *     summary: activate a user by identifier (email, phone, or username)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/suspendUser'
 *     responses:
 *       200:
 *         description: User successfully activated
 *       400:
 *         description: Invalid identifier format
 *       404:
 *         description: User not found
 */
router.put('/activate', auditLogger('user activation'), validate(suspendUserSchema), activateUser)


//delete user

/**
 * @swagger
 * /user:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user account
 *     description: Deletes a user using their email, phone number, or username and confirms with the  password of deleter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/deleteUser'
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (invalid password)
 *       404:
 *         description: User not found
 */

router.delete('/', validate(deleteUserSchema), auditLogger('delete user'), deleteUserController)

export default router;