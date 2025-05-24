import { Program } from "../../models/universityData/program.mjs";
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

export const createProgram = async (req, res) => {
  try {
        if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { name, type, isHidden, department, description } = req.body
    const createdBy = req.user.id
    if(!name) return res.status(400).json({message: 'name is required'})    
    if(!type) return res.status(400).json({message: 'type is required'})
    if(!department) return res.status(400).json({message: 'department is required'})
        const foundDepartment = await Department.findById({_id: new ObjectId(department)})
    if(!foundDepartment) return res.status(404).json({message: `no department found with id ${department}`})
        const departmentName = foundDepartment.name
    const program = {
        name, description, isHidden, createdBy, department, type, departmentName
    }
    const newProgram = await Program.create(program) 
    if(!newProgram) return res.status(400).json({message: 'program could not created'})
    res.status(201).json({ message: 'program created', data: newProgram });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAllPrograms = async (req, res) => {
  try {
   const programs = await Program.find({ isHidden: { $ne: true }});
   if(!programs) return res.status(404).json({message: 'no program could be found'})
    return res.status(200).json({payload: programs})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById({_id: new ObjectId(id)})
    if(!program) return res.status(404).json({message: `no program could be found with id: ${id}`})
   return res.status(200).json({payload: program});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateProgram = async (req, res) => {
  try {
    
    if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(401).json({message: 'un authorize'})
    const { id } = req.params;
    const {  name, type, isHidden, department, description } = req.body;
    let departmentFound
    
        if(department && ObjectId.isValid(department)){
            departmentFound = await Department.findById({_id: new ObjectId(department)})
        if(!departmentFound) return res.status(404).json({message: 'no deartments could be found pleas enter valide department id'})}
        else{
        return res.status(400).json({message: 'deparment must be valide objectId '})
        }


    let updatedProgramData = {}

    name? updatedProgramData.name = name : ''
    description? updatedProgramData.description = description : ''
    isHidden? updatedProgramData.isHidden = isHidden : ''
    type? updatedProgramData.type = type : ''
    departmentFound? updatedProgramData.departmentName = departmentFound.name : ''
    departmentFound? updatedProgramData.department = departmentFound._id : ''
    updatedProgramData.updatedAt = new Date()
    updatedProgramData.updatedBy = req.user.id

          const updatedProgram = await Program.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
              $set: updatedProgramData,
            },
            { new: true }
          );
    
          if (!updatedProgram) {
            return res.status(400).json({ message: "program could not be updated" });
          }
          return res.status(200).json({updatedProgram})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteProgram = async (req, res) => {
  try {
    if(req.user.role !== 'admin' && req.user.role !== 'cda') return res.sendStatus(401)
      try {
        const { id } = req.params;
        const program = await Program.findOne({_id: new ObjectId(id)})
        if(!program) return res.status(404).json({message: `no program to be deleted with id ${id}`})
        const deleted = await Program.findOneAndDelete({_id: new ObjectId(id)})
            if(!deleted) return res.status(400).json({message: 'program could not be deleted'})
              res.sendStatus(200);
      } catch (err) {
        console.error("Delete program Error:", err);
        res.status(500).json({ error: "Failed to delete program" });
      }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const searchProgram = async (req, res) => {
  try {
    const { searchValue, page = 1, limit = 10 } = req.query;
    let query = {};
    if (searchValue) {
      query = { $text: { $search: searchValue } };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const programs = await Program.find(query)
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Program.countDocuments(query);

    if (!programs || programs.length === 0) {
      return res.status(404).json({ message: "No programs found" });
    }
    return res.status(200).json({
      payload: programs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    }).limit(1000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const filterPrograms = async (req, res) => {
  try {
    if(req.user?.role !== 'admin' && req.user?.role !== 'cda') return res.status(403).json({message: 'forbiden'})
    const {
      name,
      type,
      department,
      isHidden,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (type) {
      filter.type = type;
    }
    if (department) {
      filter.departmentName = { $regex: department, $options: 'i' };
    }
    if (isHidden !== undefined) {
      filter.isHidden = isHidden === 'true' || isHidden === true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const programs = await Program.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Program.countDocuments(filter);

    return res.status(200).json({
      payload: programs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    }).limit(1000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};