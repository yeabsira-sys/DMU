import { mongoose } from "../../config/db.mjs";

const officeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  president: { type: String },
  msg: { type: String },
  phone: { type: String },
  email: { type: String },
  pobox: { type: String },
  ishidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  images: [
      {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
      uri: {type: String, required: true},
      name: {type: String, required: true}
    }],});

export const Office = mongoose.model('Office', officeSchema);
