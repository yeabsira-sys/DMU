import { bucket } from '../config/fileStream.mjs';
import { Readable } from 'stream';
import { File } from '../models/file.mjs';
import { parse} from 'csv-parse/sync';
import XLSX from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();

// Helper to extract data from buffer based on mimetype
const extractDataFromBuffer = (buffer, mimetype) => {
  if (mimetype === 'text/csv') {
    const text = buffer.toString('utf8');
    return parse(text, { columns: true, skip_empty_lines: true });
  }
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel'
  ) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
  throw new Error('Unsupported file type');
};

// Advanced upload and extract controller
export const uploadAndExtractFile = async (req, res, next) => {
  try {
    const files = req.files;
    const data = req?.data;
    const fileRefs = [];
    const extractedData = [];
    // console.log(JSON.stringify(files, null, 2));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      let data;
      try {
        data = extractDataFromBuffer(file.buffer, file.mimetype);
      } catch (err) {
        return res.status(400).json({ error: `Failed to parse file: ${file.originalname}` });
      }

      const readableStream = Readable.from(file.buffer);
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: {
          uploadedBy: req.user?.id || 'anonymous',
          mimetype: file.mimetype,
        },
        contentType: file.mimetype,
      });

      await new Promise((resolve, reject) => {
        readableStream.pipe(uploadStream)
          .on('error', reject)
          .on('finish', () => resolve());
      });

      const fileDoc = await File.create({
        filename: file.filename || file.originalname,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploadDate: new Date(),
        fileId: uploadStream.id,
        uploader: req.user?.id,
      });

      fileRefs.push({
        id: uploadStream.id,
        uri: `http://localhost:${process.env.PORT}/file/download/${uploadStream.id}`,
        name: file.originalname,
        type: file.mimetype,
      });
      extractedData.push({
        file: file.originalname,
        data,
        fileDoc,
      });
    }
    req.fileRefs = fileRefs
    //     res.status(201).json({
    //   files: fileRefs,
    //   extracted: extractedData,
    // });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload or extraction failed' });
  }
};