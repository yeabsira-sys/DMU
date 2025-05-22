import { News } from "../models/News.mjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../utils/isFileExist.mjs";
import { deleteFiles } from "../services/deleteFileService.mjs";
import { changeMetadata } from "../services/changeFileMetaData.mjs";
import { ObjectId } from "mongodb";
import { removeMatchIds } from "../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const imageFilePath = path.join("C:", "User", "HP", "dmuweb", "imagefile.json");

try {
  let updatedImages = null;

  // CASE 1: Images have changed
  if (imageChanged) {
    let images = [];

    if (await fileExists(imageFilePath)) {
      const imageDataContent = await fs.readFile(imageFilePath, "utf8");
      images = JSON.parse(imageDataContent);
      await fs.unlink(imageFilePath);
    }

    // Remove matched image IDs from formerImages and merge new ones
    updatedImages = await removeMatchIds(imageIds, formerImages, images);

    // Delete old files from storage
    await deleteFiles(imageIds);
  }

  // CASE 2: Metadata (e.g., image name) has changed
  if (!imageChanged && imageNames) {
    const changes = await changeMetadata(imageNames);

    if (changes?.acknowledged) {
      // Update formerImages' metadata
      for (let name of imageNames) {
        const img = formerImages.find((f) => f.id === name.id);
        if (img) img.name = name.name;
      }
      updatedImages = formerImages;
    }
  }

  // Apply updates to DB
  const finalData = {
    ...updatedData,
    ...(updatedImages && { images: updatedImages }),
  };

  const updatedNews = await News.findByIdAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: finalData },
    { new: true }
  );

  if (!updatedNews) {
    return res.status(400).json({ message: "News could not be updated" });
  }

  return res.status(200).json({ payload: updatedNews });
} catch (error) {
  console.error("Update failed:", error);
  return res.status(500).json({ message: "Internal Server Error" });
}
