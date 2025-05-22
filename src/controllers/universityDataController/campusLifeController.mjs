import { CampusLife } from "../../models/universityData/campusLife.mjs";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../../utils/isFileExist.mjs";
import { deleteFiles } from "../../services/deleteFileService.mjs";
import { removeMatchIds } from "../../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const createCampusLife = async (req, res) => {
  try {
        if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { name, description, isHidden } = req.body;
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
    const campusLife = {
        name, description, isHidden, images
    }
    const newCampus = await CampusLife.create(campusLife) 
    if(!newCampus) return res.status(400).json({message: 'campus could not created'})
    res.status(201).json({ message: 'Campus created', data: newCampus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllCampusLife = async (req, res) => {
  try {
   const campusLifes = await CampusLife.find({ isHidden: { $ne: true }});
   if(!campusLifes) return res.status(404).json({message: 'no campuses could be found'})
    return res.status(200).json({payload: campusLifes})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getCampusLifeById = async (req, res) => {
  try {
    const { id } = req.params;
    const campusLife = await CampusLife.findById({_id: new ObjectId(id)})
    if(!campusLife) return res.status(404).json({message: `no campus could be found with id: ${id}`})
   return res.status(200).json({payload: campusLife});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateCampusLife = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageChanged, formerImages, imageIds, name, description, isHidden, } = req.body;
    let updatedCampusLifeData = {}
    name? updatedCampusLifeData.name = name : ''
    description? updatedCampusLifeData.description = description : ''
    updatedCampusLifeData.updatedAt = new Date();
    isHidden !== null || isHidden !== undefined ? updatedCampusLifeData.isHidden = isHidden : ''
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
          updatedCampusLifeData = {
            ...updatedCampusLifeData,
            images: newImage,
          };
    
          const updatedCampusLife = await CampusLife.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedCampusLifeData,
            },
            { new: true }
          );
    
          if (!updatedCampusLife) {
            return res.status(400).json({ message: "campus could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedCampusLife,
          });
     
          // console.log(images);
         
        } else {
          const updatedCampusLife = await CampusLife.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedCampusLifeData,
            },
            { new: true }
          );
    
          if (!updatedCampusLife) {
            return res.status(400).json({ message: "campuses could not be updated" });
          }
          res.status(200).json({
            payload: updatedCampusLife,
          });
        }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteCampuLife = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const news = await CampusLife.findOne({_id: new ObjectId(id)})
        if(!news) return res.status(404).json({message: `no campuses to be deleted with id ${id}`})
          const images = news.images
    
        let imagesId = []
        
        images.map((image) => {
          imagesId.push(image.id)
        })
          const returnVal = await deleteFiles(imagesId)
          if(!returnVal) return res.status(400).json({message: 'campuses cant be deleted'})
    
            const deleted = await CampusLife.findOneAndDelete({_id: new ObjectId(id)})
            if(!deleted) return res.status(400).json({message: 'campuses could not be deleted'})
              res.sendStatus(200);
      } catch (err) {
        console.error("Delete campus Error:", err);
        res.status(500).json({ error: "Failed to delete campus" });
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

