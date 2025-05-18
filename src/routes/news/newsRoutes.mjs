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


const router = express.Router();

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

router.post("/", validate(createNewsValidationSchema), newsPostController);

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

router.get('/search', validateNewsSearch(searchNewsValidationSchema), filterNews )

// update news info

router.get("/:_id", validateObjectId(objectIdValidation), getNewsById)


router.patch("/:_id", validate(editNewsValidationSchema), updateNews)

router.put('/hide', validateObjectId(objectIdValidation), hideNews)
// delete news

router.delete("/:_id", validateObjectId(objectIdValidation), deleteNews)

export default router;
