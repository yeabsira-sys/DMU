import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  description: String,
  images: [
    {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'images.files'},
    uri: {type: String, required: true},
    name: {type: String, required: true}
  }],
  author: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isHidden: { type: Boolean, default: false },
  socialMediaPosted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null},
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  strong: { type: Boolean, default: false}
});

export const News = mongoose.model('News', newsSchema);