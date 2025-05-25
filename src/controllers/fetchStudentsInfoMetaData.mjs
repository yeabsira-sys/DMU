import { StudentsInfo } from "../models/studentsinfo.mjs";


export const fetchStudentInfoMetaData = async (req, res) => {
  try {
    const studentInfo = await StudentsInfo.find({});
    if (!studentInfo || studentInfo.length === 0) {
      return res.status(404).json({ success: false, error: "No student info found" });
    }
    res.status(200).json({ success: true, studentInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}