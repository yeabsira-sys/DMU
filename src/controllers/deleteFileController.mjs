import { deleteFiles } from '../services/deleteFileService.mjs';

export const deleteImages = async (req, res) => {
const images = req.body.images;
const isArray = Array.isArray(images)
  isArray ? '' : res.status(400).json({err: 'must be array'}) 
      try {
    await deleteFiles(images);
    res.status(200).json({ message: 'Image(s) deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
