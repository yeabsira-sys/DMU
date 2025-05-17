import express from "express";
import { validate } from "../../middlewares/validate.mjs";
import {
  createNewsValidationSchema,
  editNewsValidationSchema,
  searchNewsValidationSchema
} from "../../validations/newsSchema.mjs";
import { newsPostController, filterNews, filterNewsAdmin, getNewsById, updateNews } from "../../controllers/newsControllers.mjs";
import { validateNewsSearch } from "../../middlewares/validateNewsSearch.mjs";
import { validateObjectId } from "../../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../../validations/objectIdValidation.mjs";


const router = express.Router();

// create news

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Upload news 
 *     tags:
 *       - News
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Research Published"
 *               content:
 *                 type: string
 *                 example: "DMU researchers published a new study in AI."
 *     responses:
 *       201:
 *         description: News created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imageId:
 *                         type: string
 *                       filename:
 *                         type: string
 *                       caption:
 *                         type: string
 *       500:
 *         description: Upload failed
 */

router.post("/", validate(createNewsValidationSchema), newsPostController);

// search for news  
router.get('/', validateNewsSearch(searchNewsValidationSchema), filterNewsAdmin )

// update news info

router.get("/:_id", validateObjectId(objectIdValidation), getNewsById)


router.patch("/:_id", validate(editNewsValidationSchema), updateNews)


// delete news

router.delete("/", (req, res) => {
  res.status(200).send("student deleted");
});

export default router;
