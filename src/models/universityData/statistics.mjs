import { mongoose } from "../../config/db.mjs";


const statisticsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
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

export const Statistics =  mongoose.model('Statistics', statisticsSchema);
