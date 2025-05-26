import { mongoose } from "../../config/db.mjs";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  school: { type: mongoose.Schema.Types.ObjectId },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  images: [
      {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
      uri: {type: String, required: true},
      name: {type: String, required: true}
    }],});

export const Department = mongoose.model('Department', departmentSchema);
