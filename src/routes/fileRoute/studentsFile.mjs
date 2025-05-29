import express from "express";
import { upload } from "../../config/fileStream.mjs";
import { studentsInfoValidationSchema } from "../../validations/studentFileValidation.mjs";
import { validate } from "../../middlewares/validate.mjs";
import { StudentsInfo } from "../../models/studentsinfo.mjs";
import { uploadAndExtractFile } from "../../controllers/CSV_XLXS_FileUploader.mjs";
import { deleteFiles } from '../../services/deleteFileService.mjs'
import { validateObjectId } from "../../middlewares/validateObjectID.mjs";
import { objectIdValidation } from "../../validations/objectIdValidation.mjs";
import { streamFileById } from "../../controllers/streamFileById.mjs";
import { fetchStudentInfoMetaData } from "../../controllers/fetchStudentsInfoMetaData.mjs";
import { auditLogger } from "../../middlewares/auditLoger.mjs";

const adminStudentsFileRouter = express.Router();
const publicStudentsFileRouter = express.Router();
const adminDownload = express.Router()
const publicDownload = express.Router()


/**
 * @swagger
 * /studentsinfo/upload:
 *   post:
 *     tags:
 *       - StudentsInfo
 *     summary: Upload student info with csv, xlsx file
 *     description: Uploads student information along with a file (CSV or XLSX) and extracts data from the file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Student Results"
 *               description:
 *                 type: string
 *                 example: "Semester 1 results"
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               data: 
 *                  type: object
 *                  items: 
 *                    type: object
 *     responses:
 *       201:
 *         description: Student info uploaded successfully
 *       400:
 *         description: Validation error
 */


adminStudentsFileRouter.post(
  "/upload",
  auditLogger('uploading students info'),
    validate(studentsInfoValidationSchema),
  upload.array("file"),
    uploadAndExtractFile,
  async (req, res) => {
        try {
    if(req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
      const fileRefs = req.fileRefs 
      const studentInfo = await StudentsInfo.create({
        ...req.body,
        file: fileRefs,
      });
      if (!studentInfo) {
        let fileIds = fileRefs.map(file => file.id);
        await deleteFiles(fileIds);
        return res.status(400).json({ success: false, error: "Failed to create student info" });
      }
      res.status(201).json({ success: true, studentInfo });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/**
 * @swagger
 * /studentsinfo/file:
 *   get:
 *     tags:
 *       - StudentsInfo
 *     summary: get student info file metaData
 *     description: get students info file metaData with its id or you can get with its uri from the file array of objects .
 *     responses:
 *       200:
 *         description: Student info metaData successfully fetched
 *       400:
 *         description: Validation error
 */

adminStudentsFileRouter.get('/file', auditLogger('fething students file'), fetchStudentInfoMetaData)
publicStudentsFileRouter.get('/file', fetchStudentInfoMetaData)


/**
 * @swagger
 * /studentsinfo/file/download/{id}:
 *   get:
 *     tags:
 *       - StudentsInfo
 *     summary: Download a CSV file by ID
 *     description: Streams a CSV file for download by its file ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CSV file to download
 *     responses:
 *       200:
 *         description: CSV file streamed successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */

adminDownload.get("/file/download/:id",
    auditLogger('downloading students file'), 
     validateObjectId(objectIdValidation), 
streamFileById);
publicDownload.get("/file/download/:id", validateObjectId(objectIdValidation), 
streamFileById);

export { adminStudentsFileRouter, publicStudentsFileRouter, adminDownload, publicDownload };