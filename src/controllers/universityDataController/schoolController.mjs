import { School } from "../../models/universityData/school.mjs";
import { ObjectId } from "mongodb";
import { Colledge } from '../../models/universityData/colledge.mjs';

export const createSchool = async (req, res) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "cda")
      return res.status(401).json({ message: "unauthorize" });
    const { name, description, mission, vision, phone, email, college, isHidden, location } =
      req.body;
    
      if(college && ObjectId.isValid(college)){
        const collegeExists = await Colledge.findById( new ObjectId(college));
        if (!collegeExists)
          return res.status(404).json({ message: "college not found" });
      }else{
        return res.status(400).json({ message: "invalid college id" });
      }
    const school = {
      name,
      location,
      phone,
      email,
      isHidden,
      description,
      mission,
      vision,
      college,
      createdBy: req.user.id,
    };
    const isEmailAndPhoneReserved = await School.exists({ phone, email });
    if (isEmailAndPhoneReserved)
      return res
        .status(403)
        .json({
          message:
            "the phone number and or email is reserved to another school, change another one",
        });
    const newSchool = await School.create(school);
    if (!newSchool)
      return res.status(400).json({ message: "school could not created" });
    res.status(201).json({ message: "school created", data: newSchool });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find({ isHidden: { $ne: true } });
    if (!schools || schools.length === 0)
      return res.status(404).json({ message: "no schools could be found" });
    return res.status(200).json({ payload: schools });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findById({ _id: new ObjectId(id) });
    if (!school  || school.length === 0)
      return res
        .status(404)
        .json({ message: `no school could be found with id: ${id}` });
    return res.status(200).json({ payload: school });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, mission, vision, phone, email, college, isHidden, location } =
      req.body;
    let updatedSchoolData = {};
    name ? (updatedSchoolData.name = name) : "";
    updatedSchoolData.updatedAt = new Date();
    description ? (updatedSchoolData.description = description) : "";
    phone ? (updatedSchoolData.phone = phone) : "";
    email ? (updatedSchoolData.email = email) : "";
    mission ? (updatedSchoolData.pobox = mission) : "";
    isHidden ? (updatedSchoolData.location = isHidden) : "";
    vision ? (updatedSchoolData.vision = vision) : "";
    if (college && ObjectId.isValid(college)) {
      const collegeExists = await Colledge.findById(new ObjectId(college));
      if (!collegeExists)
        return res.status(404).json({ message: "college not found" });
      updatedSchoolData.college = college;
    } else {
      return res.status(400).json({ message: "invalid college id" }); 
    }
    const existingSchool = await School.findOne({
      _id: { $ne: new ObjectId(id) }, 
      $or: [{ phone }, { email }],
    });
    if (existingSchool)
      return res
        .status(403)  
        .json({
          message:
            "the phone number and or email is reserved to another school, change another one",
        });
    const updatedSchool = await School.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedSchoolData },
      { new: true }
    );
    if (!updatedSchool)
      return res.status(400).json({ message: "school could not be updated" });
    return res.status(200).json(updatedSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteSchool = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "cda")
      return res.sendStatus(401);
    try {
      const { id } = req.params;
      const school = await School.findOne({ _id: new ObjectId(id) });

      if (!school)
        return res

          .status(404)
          .json({ message: `no school to be deleted with id ${id}` });
      const deleted = await School.findOneAndDelete({

        _id: new ObjectId(id),
      });
      if (!deleted)
        return res
          .status(400)
          .json({ message: "school could not be deleted" });
      res.sendStatus(200);
    } catch (err) {
      console.error("Delete school Error:", err);
      res.status(500).json({ error: "Failed to delete school" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
