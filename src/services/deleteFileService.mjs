import { ObjectId } from 'mongodb'
import { bucket } from '../config/fileStream.mjs';

export const deleteFiles = async (ids) => {

  for (const id of ids) {
    try {
      const objectId = new ObjectId(id);
      await bucket.delete(new ObjectId(id));
      console.log(`Deleted image with ID: ${ objectId}`);
    } catch (error) {
      console.error(`Failed to delete image with ID ${id}:`, error.message);
    }
  }
  return true
};