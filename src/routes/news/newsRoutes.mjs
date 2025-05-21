import express from "express";
import { validate } from "../../middlewares/validate.mjs";
import {
  createNewsValidationSchema,
  editNewsValidationSchema,
  searchNewsValidationSchema
} from "../../validations/newsSchema.mjs";
import { newsPostController, filterNews, filterNewsAdmin, getNewsById, updateNews, deleteNews, hideNews } from "../../controllers/newsControllers.mjs";
import { validateNewsSearch } from "../../middlewares/validateNewsSearch.mjs";
import { validateObjectId } from "../../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../../validations/objectIdValidation.mjs";
import { verifyAdminOrCDA } from "../../middlewares/verifyForAdminOrCDA.mjs";
import { auditLogger } from "../../middlewares/auditLoger.mjs";

const adminNewsRouter = express.Router();
const publicNewsRouter = express.Router();

// create news

/**
 * @swagger
 * /news:
 *   post:
 *     tags:
 *       - News
 *     summary: Create a news article
 *     description: Adds a new news entry with optional social media posting and display options.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createNews'
 *     responses:
 *       201:
 *         description: News created successfully
 *       400:
 *         description: Validation error
 */

adminNewsRouter.post("/", auditLogger('creating news'),validate(createNewsValidationSchema), newsPostController);

// search for news  

/**
 * @swagger
 * /news/search:
 *   get:
 *     tags:
 *       - News
 *     summary: Search news articles
 *     description: Filter and paginate news entries based on various criteria
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *     responses:
 *       200:
 *         description: Filtered news results
 */

publicNewsRouter.get('/search', validateNewsSearch(searchNewsValidationSchema), filterNews )
/**
 * @swagger
 * /news/filter:
 *   get:
 *     tags:
 *       - News
 *     summary: Search news articles
 *     description: Filter and paginate news entries based on various criteria
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: isHidden
 *         schema:
 *           type: boolean
 *         description: Filter by visibility
 *       - in: query
 *         name: editedBy
 *         schema:
 *           type: string
 *         description: Filter by editor
 *       - in: query
 *         name: postedBy
 *         schema:
 *           type: string
 *         description: Filter by poster
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date range
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date range
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pagination limit
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: adminLoked
 *         schema:
 *           type: boolean
 *         description: Filter by admin locked status
 *       - in: query
 *         name: cdaLoked
 *         schema:
 *           type: boolean
 *         description: Filter by CDA locked status
 *       - in: query
 *         name: socialMediaPosted
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [facebook, telegram]
 *         description: Social media platforms where the news is posted
 *     responses:
 *       200:
 *         description: Filtered news results
 */


adminNewsRouter.get('/filter', auditLogger('filtering news'),validateNewsSearch(searchNewsValidationSchema), filterNewsAdmin )

// update news info

/**
 * @swagger
 * /news/{_id}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get news detail by ID
 *     description: Get detail of a news item by its MongoDB ObjectId
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the news to retrieve
 *     responses:
 *       200:
 *         description: Successful response with news data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsResponse'
 *       404:
 *         description: News item not found           
 */

adminNewsRouter.get("/:_id", validateObjectId(objectIdValidation), getNewsById)

publicNewsRouter.get("/:_id", validateObjectId(objectIdValidation), getNewsById)

/**
 * @swagger
 * /news/{_id}:
 *   patch:
 *     tags:
 *       - News
 *     summary: Edit a news article
 *     description: Update an existing news article by its ID
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: The MongoDB ObjectId of the news item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditNews'
 *     responses:
 *       200:
 *         description: News article successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: News article updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/EditNews'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: News article not found
 *       500:
 *         description: Internal server error
 */

adminNewsRouter.patch("/:_id", auditLogger('updating news'), validate(editNewsValidationSchema), updateNews)

/**
 *  @swagger
 * /news/hide/{_id}:
 *   put:
 *     tags:
 *       - News
 *     summary: Edit a news article
 *     description: Update an existing news article by its ID
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: The MongoDB ObjectId of the news item
 *     responses:
 *       200:
 *         description: News hide successfully 
 *       404:
 *         description: news could not be found
 *       400:
 *         description: invalid input
 *       500:
 *         description: Internal server error
 *       403:
 *         description: forbidden attempt
 */
adminNewsRouter.put('/hide/:_id', auditLogger('hide news'), validateObjectId(objectIdValidation), hideNews)
// delete news


/**
 *  @swagger
 * /news/{_id}:
 *   delete:
 *     tags:
 *       - News
 *     summary: delete a news article
 *     description: delete an existing news article by its ID
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: The MongoDB ObjectId of the news item
 *     responses:
 *       200:
 *         description: News deleted successfully 
 *       404:
 *         description: news could not be found
 *       400:
 *         description: invalid input
 *       500:
 *         description: Internal server error
 *       403:
 *         description: forbidden attempt
 */
adminNewsRouter.delete("/:_id", validateObjectId(objectIdValidation), deleteNews)

export {adminNewsRouter, publicNewsRouter};
