import { conn, bucket } from '../config/fileStream.mjs'
import {ObjectId} from 'mongodb'
export const streamImageById = async (req, res) => {
  try {
    const _id = req.params._id
    console.log(_id, " image id")
    const filesCollection = conn.db.collection('uploads.files');

    const file = await filesCollection.findOne({ _id: new ObjectId(_id) });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');

    const downloadStream = bucket.openDownloadStream(new ObjectId(_id));
    downloadStream.on('error', () =>{
        console.log("error piping")
        res.sendStatus(404)
    } )
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
};
