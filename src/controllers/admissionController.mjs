import { Admission } from '../models/Admission.mjs'
import {ObjectId} from 'mongodb'
import fs from 'fs/promises'
import { deleteFiles } from '../services/deleteFileService.mjs';


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

    const imageData = await fs.readFile("imagefile.json", "utf-8");
        const images = await JSON.parse(imageData);
        await fs.unlink("imagefile.json")
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
    let id = req.params?.id || null
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
        if(data[key] !== null && data[key] !== undefined)
           admission[key]= data[key];
    }
    console.log(admission, "admissions ipdate")
    // const updated = await Admission.findByIdAndUpdate(
    //   id,
    //   {
    //     ...admission,
    //     updatedAt: new Date()
    //   },
    //   {
    //     new: true,
    //     runValidators: true
    //   }
    // );

    if (!updated) {
      return res.status(404).json({ message: 'Admission program not found' });
    }

    res.status(200).json('updated');
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
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Program not found' });

    admission.isActive = !admission.isActive;
    await admission.save();

    res.json({ message: `Program ${admission.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


















































import ExcelJS from 'exceljs';

export const exportAdmissionsToExcel = async (req, res) => {
  try {
    const admissions = await Admission.find({ isDeleted: false });

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

    admissions.forEach(admission => worksheet.addRow(admission));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=admissions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
