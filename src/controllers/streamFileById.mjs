import { conn, bucket } from '../config/fileStream.mjs'
import {ObjectId} from 'mongodb'
export const streamFileById = async (req, res) => {
  try {
    const id = req.params.id
    const filesCollection = conn.db.collection('images.files');

    const file = await filesCollection.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
     res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    downloadStream.on('error', () =>{
        console.log("error piping")
        res.sendStatus(404)
    })
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
};
