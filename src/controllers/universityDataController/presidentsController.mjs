import { Presidents } from "../../models/universityData/presidents.mjs";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../../utils/isFileExist.mjs";
import { deleteFiles } from "../../services/deleteFileService.mjs";
import { removeMatchIds } from "../../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createPresident = async (req, res) => {
  try {
        if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { name, description, isHidden, startDate, endDate } = req.body;
    const imageFilePath = path.join("imagefile.json")
            let images
            console.log(imageFilePath)
          if( await fileExists(imageFilePath)){
            const imageData = await fs.readFile('imagefile.json', 'utf8')
            images = JSON.parse(imageData);
            await fs.unlink(imageFilePath);
          }
          else{
            images = []
          }
          endDate? endDate = null : ''
          const createdBy = req.user.id
    const president = {
        name, description, images, isHidden, startDate, endDate, createdBy
    }
    const newPresident = await Presidents.create(president) 
    if(!newPresident) return res.status(400).json({message: 'president could not created'})
    res.status(201).json({ message: 'president created', data: newPresident });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllPresidents = async (req, res) => {
  try {
   const presidents = await Presidents.find({ isHidden: { $ne: true }});
   if(!presidents) return res.status(404).json({message: 'no presidents could be found'})
    return res.status(200).json({payload: presidents})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getPresidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const president = await Presidents.findById({_id: new ObjectId(id)})
    if(!president) return res.status(404).json({message: `no president could be found with id: ${id}`})
   return res.status(200).json({payload: president});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updatePresident = async (req, res) => {
  try {
    if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { id } = req.params;
    const { imageChanged, formerImages, imageIds, name, description, startDate, endDate, isHidden } = req.body;
    let updatedPresidentData = {}

    name? updatedPresidentData.name = name : ''
    description? updatedPresidentData.description = description : ''
    startDate? updatedPresidentData.startDate = startDate : ''
    endDate? updatedPresidentData.endDate = endDate : ''
    isHidden? updatedPresidentData.isHidden = isHidden : ''
    updatedPresidentData.updatedAt = new Date()
    updatedPresidentData.updatedBy = req.user.id

        if (imageChanged) {
          const imageFilePath = path.join("imagefile.json")
            let images
          if( await fileExists(imageFilePath)){
            const imageData = await fs.readFile('imagefile.json', 'utf-8')
            images = JSON.parse(imageData);
            await fs.unlink(imageFilePath);
          }
          else{
            images = []
          }
               const newImage = await removeMatchIds(imageIds, formerImages, images);
          // console.log(newImage)
          updatedPresidentData = {
            ...updatedPresidentData,
            images: newImage,
          };
    
          const updatedPresident = await Presidents.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedPresidentData,
            },
            { new: true }
          );
    
          if (!updatedPresident) {
            return res.status(400).json({ message: "president could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedPresident,
          });
     
          // console.log(images);
         
        } else {
          const updatedPresident = await Presidents.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedPresidentData,
            },
            { new: true }
          );
    
          if (!updatedPresident) {
            return res.status(400).json({ message: "president could not be updated" });
          }
          res.status(200).json({
            payload: updatedPresident,
          });
        }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deletePresident = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const president = await Presidents.findOne({_id: new ObjectId(id)})
        if(!president) return res.status(404).json({message: `no President to be deleted with id ${id}`})
          const images = president.images
    
        let imagesId = []
        
        images.map((image) => {
          imagesId.push(image.id)
        })
          const returnVal = await deleteFiles(imagesId)
          if(!returnVal) return res.status(400).json({message: 'President can not be deleted'})
    
            const deleted = await Presidents.findOneAndDelete({_id: new ObjectId(id)})
            if(!deleted) return res.status(400).json({message: 'President could not be deleted'})
              res.sendStatus(200);
      } catch (err) {
        console.error("Delete President Error:", err);
        res.status(500).json({ error: "Failed to delete President" });
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

