import {  bucket} from '../config/fileStream.mjs'
import { Readable } from 'stream';
import fs from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()

// upload files/ images
export const uploadFile = async (req, res, next) => {
  try {
    const { title, content, captions, imageFor } = req.body;
    const captionsArray = captions? captions.split(',') : '';
    const imageRefs = [];
    // console.log(captionsArray)
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const readableStream = Readable.from(file.buffer);
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: {
          uploadedBy: req.user?.userName || 'anonymose',
          caption: captionsArray[i]? captionsArray[i] : captionsArray[0],
          title: title || '',
          content: content || ''
        },
        contentType: file.mimetype,
      });
      await new Promise((resolve, reject) => {
        readableStream.pipe(uploadStream)
          .on('error', reject)
          .on('finish', (uploadedFile) => {
            imageRefs.push(
              {
               id: uploadStream.id,
               uri: `http://localhost:${process.env.PORT}/file/image/` + uploadStream.id,
               name: file.originalname
              }
            );
            resolve();
          });
      });
    }


    await fs.writeFile('imagefile.json', JSON.stringify(imageRefs, null, 2));
   res.status(201).json({imageID: imageRefs})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
