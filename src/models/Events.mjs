import { mongoose } from "../config/db.mjs";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  eventType: { type: String, enum: ['Seminar', 'Workshop', 'Conference', 'Cultural', 'Sports', 'Other'], required: true },
  description: { type: String },
  organizer: { type: String },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date },
  location: { type: String },
  registrationRequired: { type: Boolean, default: false },
  registrationLink: { type: String },
  audience: { type: String },
  speakers: [
    {
      name: String,
      bio: String,
      affiliation: String
    }
  ],
  eventImages: [
    {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
    uri: {type: String, required: true},
    name: {type: String, required: true}
  }],
  agenda: { type: String },
  contactInfo: { type: String },
  category: { type: String },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  recurrence: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  socialMediaPosted: {
    type: [String], 
    enum: ['facebook', 'telegram'],
    default: []
  }
});

export const Event = mongoose.model('Event', EventSchema);