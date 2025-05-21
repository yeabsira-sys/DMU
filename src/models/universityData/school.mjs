import { mongoose } from "../../config/db.mjs";


const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  mission: { type: String },
  vision: { type: String },
  location: { type: String },
  email: { type: String },
  phone: { type: String },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
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

export const School = mongoose.model('School', schoolSchema);
