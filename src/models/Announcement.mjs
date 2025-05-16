import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null},
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

export const Announcement = mongoose.model('Announcement', announcementSchema);
