import { Campuses } from "../../models/universityData/campuses.mjs";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../../utils/isFileExist.mjs";
import { deleteFiles } from "../../services/deleteFileService.mjs";
import { removeMatchIds } from "../../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const createCampus = async (req, res) => {
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
    const campus = {
        name, description, images, isHidden
    }
    const newCampus = await Campuses.create(campus) 
    if(!newCampus) return res.status(400).json({message: 'campus could not created'})
    res.status(201).json({ message: 'Campus created', data: newCampus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllCampuses = async (req, res) => {
  try {
   const campuses = await Campuses.find({ isHidden: { $ne: true }});
   if(!campuses) return res.status(404).json({message: 'no campuses could be found'})
    return res.status(200).json({payload: campuses})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getCampusById = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campuses.findById({_id: new ObjectId(id)})
    if(!campus) return res.status(404).json({message: `no campus could be found with id: ${id}`})
   return res.status(200).json({payload: campus});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageNames, imageChanged, formerImages, imageIds, name, description } = req.body;
    let updatedCampusData = {}
    name? updatedCampusData.name = name : ''
    description? updatedCampusData.description = description : ''
    updatedCampusData.updatedAt = new Date()
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
          updatedCampusData = {
            ...updatedCampusData,
            images: newImage,
          };
    
          const updatedCampus = await Campuses.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedCampusData,
            },
            { new: true }
          );
    
          if (!updatedCampus) {
            return res.status(400).json({ message: "campus could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedCampus,
          });
     
          // console.log(images);
         
        } else {
          const updatedCampus = await Campuses.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedCampusData,
            },
            { new: true }
          );
    
          if (!updatedCampus) {
            return res.status(400).json({ message: "campuses could not be updated" });
          }
          res.status(200).json({
            payload: updatedCampus,
          });
        }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteCampus = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const news = await Campuses.findOne({_id: new ObjectId(id)})
        if(!news) return res.status(404).json({message: `no campuses to be deleted with id ${id}`})
          const images = news.images
    
        let imagesId = []
        
        images.map((image) => {
          imagesId.push(image.id)
        })
          const returnVal = await deleteFiles(imagesId)
          if(!returnVal) return res.status(400).json({message: 'campuses cant be deleted'})
    
            const deleted = await Campuses.findOneAndDelete({_id: new ObjectId(id)})
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

