import { ObjectId } from 'mongodb'
import {mongoose} from '../config/db.mjs';

export const changeMetadata = async (imageNames) => {

  for (const image of imageNames) {
    try {
      const updatedImage = await mongoose.connection.db.collection('images.files').updateOne(
        {_id: new ObjectId(image.id)},
        {$set: {'filename': image.name}}
      )
      return updatedImage
    } catch (error) {
      console.error(`Failed to delete image with ID ${id}:`, error.message);
    }
  }
};