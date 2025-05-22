import { mongoose } from "../../config/db.mjs";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  location: { type: String },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  images: [
      {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
      uri: {type: String, required: true},
      name: {type: String, required: true}
    }], });

export const Colledge =  mongoose.model('College', collegeSchema);
