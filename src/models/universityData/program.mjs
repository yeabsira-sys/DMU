import { mongoose } from "../../config/db.mjs";

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {type: [String], enum: ['undergraduate','postgraduate','diploma','phd','doctorate','master','bachelor',] },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },
isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  images: [
      {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
      uri: {type: String, required: true},
      name: {type: String, required: true}
    }], 
    departmentName: { type: String, required: true },
  description: { type: String},
  });

  programSchema.index({ name: 'text', type: 'text', departmentName: 'text', description: 'text' });
  programSchema.index({ name: 1, type: 1, departmentName: 1, description: 1 }, { unique: true });
  programSchema.index({ createdAt: -1 });
  programSchema.index({ updatedAt: -1 });
  programSchema.index({ createdBy: 1 });
  programSchema.index({ updatedBy: 1 });

export const Program = mongoose.model('Program', programSchema);
