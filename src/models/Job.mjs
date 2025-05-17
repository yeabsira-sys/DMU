import { mongoose } from "../config/db.mjs";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null},
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

export const Job = mongoose.model('Job', jobSchema);