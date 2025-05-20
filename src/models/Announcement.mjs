import { mongoose } from "../config/db.mjs";

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'admission',
      'job',
      'event',
      'academic',
      'staff',
      'student',
      'research',
      'general',
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String, // e.g., "Computer Science", "Admissions Office"
  },
  targetAudience: {
    type: [String], // e.g., ["students", "faculty", "public"]
    default: ['public'],
  },
  startDate: {
    type: Date, // For events, registration, or job opening period
  },
  endDate: {
    type: Date, // When it expires or ends
  },
  applicationLink: {
    type: String, // For admissions, jobs, etc.
  },
  location: {
    type: String, // Venue or department office
  },
  contactInfo: {
    type: String, // Phone, email, or contact person
  },
  attachments: {
    type: [String], // URLs or file paths for PDFs, posters, etc.
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin or staff who posted the announcement
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refpath: 'type', // Admin or staff who posted the announcement
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published',
  },
  tags: {
    type: [String], 
  },
}, {
});

export const Announcement = mongoose.model('Announcement', announcementSchema);