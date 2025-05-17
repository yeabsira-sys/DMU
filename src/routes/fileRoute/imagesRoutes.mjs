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

const router = express.Router()
router.post('/news/image', upload.array('images'),  validateImageData(imageValidation), uploadFile );

// get image by id
router.get('/image/:_id', validateObjectId(objectIdValidation), streamImageById )

// Delete image
router.delete('/image', validateArrayObjectId(objectIdValidation), deleteImages )
export default router;