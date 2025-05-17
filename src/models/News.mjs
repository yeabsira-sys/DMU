import { mongoose } from "../config/db.mjs";

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  description: String,
  detail: String,
  images: [
    {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
    uri: {type: String, required: true},
    name: {type: String, required: true}
  }],
  author: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isHidden: { type: Boolean, default: false },
  socialMediaPosted: {
    type: [String], 
    enum: ['facebook', 'telegram'],
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null},
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  strong: { type: Boolean, default: false},
  adminLoked: { type: Boolean, default: false},
  cdaLoked: { type: Boolean, default: false},
});

export const News = mongoose.model('News', newsSchema);