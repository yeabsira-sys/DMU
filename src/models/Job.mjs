import { mongoose } from "../config/db.mjs";

const JobOpeningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'], required: true },
  jobLevel: { type: String },
  description: { type: String },
  requiredQualifications: { type: String },
  preferredQualifications: { type: String },
  experienceRequired: { type: String },
  applicationDeadline: { type: Date, required: true },
  postingDate: { type: Date, default: Date.now },
  salaryRange: { type: String },
  location: { type: String },
  applicationProcess: { type: String },
  applicationLink: { type: String },
  documentsRequired: [String],
  contactEmail: { type: String },
  jobReferenceCode: { type: String },
  equalOpportunityStatement: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isHidden: {type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

export const JobOpening = mongoose.model('JobOpening', JobOpeningSchema);