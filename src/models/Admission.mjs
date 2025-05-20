import { mongoose } from "../config/db.mjs";

const AdmissionProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degreeLevel: { type: String, enum: ['Undergraduate', 'Postgraduate', 'PhD'], required: true },
  department: { type: String, required: true },
  description: { type: String },
  eligibilityRequirements: { type: String },
  admissionCriteria: { type: String },
  applicationStartDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  modeOfStudy: { type: String, enum: ['Full-time', 'Part-time', 'Online'] },
  duration: { type: String },
  tuitionFees: { type: String },
  scholarshipInfo: { type: String },
  applicationLink: { type: String },
  contactInfo: { type: String },
  campusLocation: { type: String },
  programCode: { type: String },
  requiredDocuments: [String],
  faq: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  images: [
      {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
      uri: {type: String, required: true},
      name: {type: String, required: true}
    }],
});

AdmissionProgramSchema.index({ name: 'text', department: 'text', description: 'text' });

export const Admission = mongoose.model('AdmissionProgram', AdmissionProgramSchema);
