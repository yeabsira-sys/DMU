import express from "express";
import { validate } from "../../middlewares/validate.mjs";
import { createNewsValidationSchema, editNewsValidationSchema } from "../../validations/newsSchema.mjs";
import { newsPostController } from '../../controllers/newsControllers.mjs'
import { uploadFile } from "../../controllers/fileUploadController.mjs";
import {imageValidation } from '../../validations/imageValidation.mjs'
import { upload } from "../../config/fileStream.mjs";
import { validateImageData } from "../../middlewares/validateImageData.mjs";

const router = express.Router();

//get all news
router.get('/', (req, res) => {
    res.status(200).send('success')
})

// create news
router.post('/',
     validate(createNewsValidationSchema), newsPostController )

// update news info

router.put('/', (req, res) => {
    res.status(200).send('info updated')
})

// delete news

router.delete('/', (req, res) => {
    res.status(200).send('student deleted')
})

export default router;