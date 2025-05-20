import express from 'express'
import { upload } from '../../config/fileStream.mjs'
import { uploadFile } from '../../controllers/fileUploadController.mjs';
import { imageValidation } from '../../validations/imageValidation.mjs';
import { validateImageData } from '../../middlewares/validateImageData.mjs';
import { validateObjectId } from '../../middlewares/validateObjectID.mjs'
import { objectIdValidation } from '../../validations/objectIdValidation.mjs';
import { streamImageById } from '../../controllers/getImageController.mjs';
import { deleteImages } from '../../controllers/deleteFileController.mjs'
import { validateArrayObjectId } from '../../middlewares/validateArrayObjectId.mjs';

const adminFileRouter = express.Router()
const publicFileRouter = express.Router()
/**
 * @swagger
 * /file/news/image:
 *   post:
 *     tags:
 *       - Image
 *     summary: Upload an image file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: file
 *                   format: binary
 *                 description: Image file (jpeg, png, webp). Max size 20MB
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mimetype:
 *                   type: string
 *                   example: image/jpeg
 *                 originalname:
 *                   type: string
 *                   example: example.jpg
 *                 size:
 *                   type: number
 *                   example: 1456789
 *       '400':
 *         description: Invalid image or validation failed
 */

adminFileRouter.post('/news/image', upload.array('images'),  validateImageData(imageValidation), uploadFile );

// get image by id
publicFileRouter.get('/image/:_id', validateObjectId(objectIdValidation), streamImageById )

adminFileRouter.get('/image/:_id', validateObjectId(objectIdValidation), streamImageById )

// Delete image
adminFileRouter.delete('/image', validateArrayObjectId(objectIdValidation), deleteImages )
export  {adminFileRouter, publicFileRouter};