import { mongoose } from "../config/db.mjs";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['admissionprograms', 'event', 'jobopening', 'news', 'studentsinfo'],
    required: true,
  },
  description: { type: String, required: true },
  department: { type: String },
  targetAudience: { type: [String], default: ['public'] },
  startDate: { type: Date },
  endDate: { type: Date },
  applicationLink: { type: String },
  location: { type: String },
  contactInfo: { type: String },
  attachments: { type: [String] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type', 
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
  },
  tags: { type: [String] },
  isHidden: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const Announcement = mongoose.model('Announcement', announcementSchema);