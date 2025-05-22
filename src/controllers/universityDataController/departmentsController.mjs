import { Department } from "../../models/universityData/department.mjs";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../../utils/isFileExist.mjs";
import { deleteFiles } from "../../services/deleteFileService.mjs";
import { removeMatchIds } from "../../services/removeMatchIds.mjs";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const createDepartment = async (req, res) => {
  try {
        if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { name, description, school, isHidden } = req.body;
        // let schoolId
        try {
           new ObjectId(school)
            // const campusExist = await Campuses.findById(campusId )
            // if(!campusExist) return res.status(400).json({message: `there is no campus collection with campu: ${campus} colledge has to reffer campus`})
        } catch (error) {
            return res.status(400).json({message: 'school is not valide object id, department has to reffer school'})
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
    const department = {
        name, description, school, isHidden, images
    }
    const newDepartment = await Department.create(department) 
    if(!newDepartment) return res.status(400).json({message: 'colledge could not created'})
    res.status(201).json({ message: 'colledge created', data: newDepartment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllDepartments = async (req, res) => {
  try {
   const departments = await  Department.find();
   if(!departments) return res.status(404).json({message: 'no departments could be found'})
    return res.status(200).json({payload: departments})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({_id: new ObjectId(id)})
    if(!department) return res.status(404).json({message: `no colledge could be found with id: ${id}`})
   return res.status(200).json({payload: department});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageChanged, formerImages, imageIds, name, description, isHidden, school } = req.body;
    // let campusId
        try {
             new ObjectId(school)
            // const campuExists = await Campuses.findById( campusId)
            // if(!campuExists) return res.status(400).json({message: `there is no campus collection with campu: ${campus} colledge has to reffer campus`})
        } catch (error) {
            return res.status(400).json({message: 'school is not valide object id, colledge has to reffer campus'})
        }
    let updatedDepartmentData = {}
    name? updatedDepartmentData.name = name : ''
    description? updatedDepartmentData.description = description : ''
    school? updatedDepartmentData.location = location : ''
    updatedDepartmentData.updatedAt = new Date();
    isHidden !== null || isHidden !== undefined ? updatedDepartmentData.isHidden = isHidden : ''
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
          updatedDepartmentData = {
            ...updatedDepartmentData,
            images: newImage,
          };
    
          const updatedDepartment = await Department.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedDepartmentData,
            },
            { new: true }
          );
    
          if (!updatedDepartment) {
            return res.status(400).json({ message: "department could not be updated" });
          }
          await deleteFiles(imageIds);
          return res.status(200).json({
            payload: updatedDepartment,
          });
     
          // console.log(images);
         
        } else {
          const updatedDepartment = await Department.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedDepartmentData,
            },
            { new: true }
          );
    
          if (!updatedDepartment) {
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

export const deleteDepartment = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const news = await Department.findOne({_id: new ObjectId(id)})
        if(!news) return res.status(404).json({message: `no Department to be deleted with id ${id}`})
          const images = news.images
    
        let imagesId = []
        
        images.map((image) => {
          imagesId.push(image.id)
        })
          const returnVal = await deleteFiles(imagesId)
          if(!returnVal) return res.status(400).json({message: 'colledge cant be deleted'})
    
            const deleted = await Department.findOneAndDelete({_id: new ObjectId(id)})
            if(!deleted) return res.status(400).json({message: 'Deparment could not be deleted'})
              res.sendStatus(200);
      } catch (err) {
        console.error("Delete colledge Error:", err);
        res.status(500).json({ error: "Failed to delete Deparment" });
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

