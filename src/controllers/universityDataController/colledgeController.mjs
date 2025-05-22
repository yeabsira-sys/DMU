import { Campuses } from "../../models/universityData/campuses.mjs";
import { Colledge} from '../../models/universityData/colledge.mjs'
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../../utils/isFileExist.mjs";
import { deleteFiles } from "../../services/deleteFileService.mjs";
import { removeMatchIds } from "../../services/removeMatchIds.mjs";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const createCollege = async (req, res) => {
  try {
        if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { name, description, location, campus, isHidden } = req.body;
        let campusId
        try {
            campusId = new ObjectId(campus)
            const campusExist = await Campuses.findById(campusId )
            if(!campusExist) return res.status(400).json({message: `there is no campus collection with campu: ${campus} colledge has to reffer campus`})
        } catch (error) {
            return res.status(400).json({message: 'campus is not valide object id, colledge has to reffer campus'})
        }

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
    const colledge = {
        name, description, campus, location, isHidden
    }
    const newColledge = await Colledge.create(colledge) 
    if(!newColledge) return res.status(400).json({message: 'colledge could not created'})
    res.status(201).json({ message: 'colledge created', data: newColledge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllColleges = async (req, res) => {
  try {
   const colledge = await  Colledge.find({ isHidden: { $ne: true }});
   if(!colledge) return res.status(404).json({message: 'no colledges could be found'})
    return res.status(200).json({payload: colledge})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const colledge = await Colledge.findById({_id: new ObjectId(id)})
    if(!colledge) return res.status(404).json({message: `no colledge could be found with id: ${id}`})
   return res.status(200).json({payload: colledge});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageChanged, formerImages, imageIds, name, description, isHidden, location, campus } = req.body;
    let campusId
        try {
            campusId = new ObjectId(campus)
            const campuExists = await Campuses.findById( campusId)
            if(!campuExists) return res.status(400).json({message: `there is no campus collection with campu: ${campus} colledge has to reffer campus`})
        } catch (error) {
            return res.status(400).json({message: 'campus is not valide object id, colledge has to reffer campus'})
        }
    let updatedColledgeData = {}
    name? updatedColledgeData.name = name : ''
    description? updatedColledgeData.description = description : ''
    location? updatedColledgeData.location = location : ''
    campus? updatedColledgeData.campus = campus : ''
    updatedColledgeData.updatedAt = new Date();
    isHidden !== null || isHidden !== undefined ? updatedColledgeData.isHidden = isHidden : ''
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
          updatedColledgeData = {
            ...updatedColledgeData,
            images: newImage,
          };
    
          const updatedColledge = await Colledge.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedColledgeData,
            },
            { new: true }
          );
    
          if (!updateCollege) {
            return res.status(400).json({ message: "campus could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedColledge,
          });
     
          // console.log(images);
         
        } else {
          const updatedColledge = await Colledge.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedColledgeData,
            },
            { new: true }
          );
    
          if (!updatedColledge) {
            return res.status(400).json({ message: "campuses could not be updated" });
          }
          res.status(200).json({
            payload: updateCollege,
          });
        }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteColledge = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const news = await Colledge.findOne({_id: new ObjectId(id)})
        if(!news) return res.status(404).json({message: `no colledge to be deleted with id ${id}`})
          const images = news.images
    
        let imagesId = []
        
        images.map((image) => {
          imagesId.push(image.id)
        })
          const returnVal = await deleteFiles(imagesId)
          if(!returnVal) return res.status(400).json({message: 'colledge cant be deleted'})
    
            const deleted = await Colledge.findOneAndDelete({_id: new ObjectId(id)})
            if(!deleted) return res.status(400).json({message: 'colledge could not be deleted'})
              res.sendStatus(200);
      } catch (err) {
        console.error("Delete colledge Error:", err);
        res.status(500).json({ error: "Failed to delete colledge" });
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

