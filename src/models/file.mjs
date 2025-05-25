import { mongoose } from '../config/db.mjs'

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  fileId: { type: mongoose.Schema.Types.ObjectId }, 
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const File = mongoose.model('File', fileSchema);