import { mongoose } from "../../config/db.mjs";

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['BSc', 'MSc', 'PhD'] },
  dept: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
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

export const Program = mongoose.model('Program', programSchema);
