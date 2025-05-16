import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  program: String,
  grades: [
    {
      courseCode: String,
      courseName: String,
      grade: String
    }
  ],
  cumulativeGPA: Number,
  dormitory: {
    block: String,
    roomNumber: Number
  },
  warnings: [String],
  createdAt: { type: Date, default: Date.now },
  profileUpdatedAt: Date
});

export const Student = mongoose.model('Student', studentSchema);