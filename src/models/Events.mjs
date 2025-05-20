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
  eventImageUrl: { type: String },
  agenda: { type: String },
  contactInfo: { type: String },
  category: { type: String },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  recurrence: { type: String }, // e.g., "Weekly", "Monthly", "One-time"
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Event = mongoose.model('Event', EventSchema);