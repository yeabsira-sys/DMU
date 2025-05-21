import { Admission } from '../models/Admission.mjs'
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fileExists } from "../utils/isFileExist.mjs";
import { deleteFiles } from "../services/deleteFileService.mjs";
import { findUserByIdentifier } from "../services/getUser.mjs";
import { changeMetadata } from "../services/changeFileMetaData.mjs";
import { ObjectId } from "mongodb";
import { removeMatchIds } from "../services/removeMatchIds.mjs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const createAdmission = async (req, res) => {
      console.log(req.user.role)
    if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
  try {
    console.log(req.user.role)
 const {
  name, degreeLevel, department, description,
  eligibilityRequirements, admissionCriteria, 
  applicationStartDate, applicationDeadline, 
  modeOfStudy, duration, tuitionFees, scholarshipInfo,
  applicationLink, contactInfo, campusLocation, programCode,
  requiredDocuments, faq, isActive
} = req.body;

let admissionData = {
  name, degreeLevel, department, description,
  eligibilityRequirements, admissionCriteria, 
  applicationStartDate, applicationDeadline, 
  modeOfStudy, duration, tuitionFees, scholarshipInfo,
  applicationLink, contactInfo, campusLocation, programCode,
  requiredDocuments, faq, isActive
};
        

   const imageFilePath = path.join("imagefile.json")
        let images
      if( await fileExists(imageFilePath)){            const imageData = await fs.readFile("imagefile.json", "utf-8");
        images = JSON.parse(imageData);
        await fs.unlink(imageFilePath);
      }
      else{
        images = []
      }
        const postedBy = req.user.id || "";
        admissionData = {
          ...admissionData,
          images: images,
          postedBy,
        };
        try {
          console.log(admissionData)
      const admission = await Admission.create(admissionData);
      return res.status(201).json({ payload: admission });
    } catch (error) {
      const imageIds = images.map((image) => image.id);
      await deleteFiles(imageIds);
    
      console.error("Failed to create admission:", error.message);
      return res.status(400).json({
        message: "admission could not be uploaded",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateAdmission = async (req, res) => {
  try {
    let id = req.params?._id || null
    if(!id) return res.status(400).json({message: 'admission id is requires!'})
      id = new ObjectId(id)
    let data = (({name,
  degreeLevel,
  department,
  description,
  eligibilityRequirements,
  admissionCriteria,
  applicationStartDate,
  applicationDeadline,
  modeOfStudy,
  duration,
  tuitionFees,
  scholarshipInfo,
  applicationLink,
  contactInfo,
  campusLocation,
  programCode,
  requiredDocuments,
  faq}) => ({name,
  degreeLevel,
  department,
  description,
  eligibilityRequirements,
  admissionCriteria,
  applicationStartDate,
  applicationDeadline,
  modeOfStudy,
  duration,
  tuitionFees,
  scholarshipInfo,
  applicationLink,
  contactInfo,
  campusLocation,
  programCode,
  requiredDocuments,
  faq}))(req.body)
  let admission = {}
  console.log(data, "data ")
    for(const key in data){
        if(data[key] !== "" && data[key] !== undefined && data[key] !== null)
           admission[key]= data[key];
    }
    const { imageNames, imageChanged, formerImages, imageIds } = req.body;
    if (imageChanged) {
      const imageFilePath = path.join("imagefile.json")
        let images
      if( await fileExists(imageFilePath)){
        const imageData = await fs.readFile('imageFile.json', 'utf-8')
        images = JSON.parse(imageData);
        await fs.unlink(imageFilePath);
      }
      else{
        images = []
      }
           const newImage = await removeMatchIds(imageIds, formerImages, images);
      // console.log(newImage)
      admission = {
        ...admission,
        images: newImage,
      };

      const updatedAdmission = await Admission.findByIdAndUpdate(
        { _id: id},
        {
          $set: admission,
        },
        { new: true }
      );

      if (!updatedAdmission) {
        return res.status(400).json({ message: "news could not be updated" });
      }
      await deleteFiles(imageIds);
      return res.status(200).json({
        payload: updatedAdmission,
      });
 
      // console.log(images);
     
    } else if (imageNames) {
      const changes = await changeMetadata(imageNames);
      console.log(changes)
      if (changes?.acknowledged == true) {
        for (let i = 0; i < imageNames.length; i++) {
          for (let j = 0; j < formerImages.length; j++) {
            if (imageNames[i].id == formerImages[j].id) {
              formerImages[j].name = imageNames[i].name
            }
          }
        }
          admission.images = formerImages
        const updatedAdmission = await admission.findByIdAndUpdate(
          { _id: id },
          {
            $set: admission,
          },
          { new: true }
        );
        if (!updatedAdmission)
          return res
            .status(400)
            .json({ message: "news could not be updated!" });
        res.status(200).json({ payload: updatedAdmission });
      }
    } else {
      const updatedAdmission = await Admission.findByIdAndUpdate(
        { _id: id },
        {
          $set: admission,
        },
        { new: true }
      );

      if (!updatedAdmission) {
        return res.status(400).json({ message: "news could not be updated" });
      }
      res.status(200).json({
        payload: updatedAdmission,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getAllAdmissions = async (req, res) => {
  try {
    const {
      keyword,
      degreeLevel,
      department,
      modeOfStudy,
      campusLocation,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      applicationOpen
    } = req.query;

    const query = { isDeleted: false };

    if (degreeLevel) query.degreeLevel = degreeLevel;
    if (department) query.department = department;
    if (modeOfStudy) query.modeOfStudy = modeOfStudy;
    if (campusLocation) query.campusLocation = campusLocation;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (applicationOpen === 'true') {
      const now = new Date();
      query.applicationStartDate = { $lte: now };
      query.applicationDeadline = { $gte: now };
    }

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const total = await Admission.countDocuments(query);
    const admissions = await Admission.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: admissions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleAdmissionStatus = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params._id);
    if (!admission) return res.status(404).json({ message: 'Program not found' });

    admission.isActive = !admission.isActive;
    await admission.save();

    res.json({ message: `Program ${admission.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get detail admission by id 

export const getAdmissionById = async (req,res) => {
  try {
    const id = req.params._id
    const detaileAdmission = await Admission.findOne({_id: new ObjectId(id)});
    if(!detaileAdmission) return res.status(404).json({message: `no admission with id : ${id}`})
    return res.status(200).json({payload: detaileAdmission})
    
  } catch (error) {
    return res.status(500).json({message: 'internal server error', error: error.message})
  }
}
 
export const deleteAdmission = async (req, res ) => {
         console.log(req.params)
  try {
      const id  = req.params._id;
      const admission = await Admission.findOne({_id: new ObjectId(id)})
      if(!admission) return res.status(404).json({message: `no admission to be deleted with id ${id}`})
        const images = admission.images
  
      let imagesId = []
      
      images.map((image) => {
        imagesId.push(image.id)
      })
        const returnVal = await deleteFiles(imagesId)
        if(!returnVal) return res.status(400).json({message: "admission can't be deleted"})
  
          const deleted = await Admission.findOneAndDelete({_id: new ObjectId(id)})
          if(!deleted) return res.status(400).json({message: 'admission could not be deleted'})
            res.sendStatus(200);
    } catch (err) {
      console.error("Delete admission Error:", err);
      res.status(500).json({ error: "Failed to delete admission" });
    }

}
import ExcelJS from 'exceljs';


export const exportAdmissionsToExcel = async (req, res) => {
  try {
    const admissions = await Admission.find({ isDeleted: false }).lean(); // lean() returns plain JS objects

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Admissions');

    worksheet.columns = [
      { header: 'Program Name', key: 'name' },
      { header: 'Degree Level', key: 'degreeLevel' },
      { header: 'Department', key: 'department' },
      { header: 'Start Date', key: 'applicationStartDate' },
      { header: 'Deadline', key: 'applicationDeadline' },
      { header: 'Mode', key: 'modeOfStudy' },
      { header: 'Duration', key: 'duration' },
      { header: 'Tuition Fees', key: 'tuitionFees' },
      { header: 'Active', key: 'isActive' },
    ];

    admissions.forEach(admission => {
      worksheet.addRow({
        name: admission.name,
        degreeLevel: admission.degreeLevel,
        department: admission.department,
        applicationStartDate: admission.applicationStartDate,
        applicationDeadline: admission.applicationDeadline,
        modeOfStudy: admission.modeOfStudy,
        duration: admission.duration,
        tuitionFees: admission.tuitionFees,
        isActive: admission.isActive,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=admissions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};