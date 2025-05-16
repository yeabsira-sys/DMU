import mongoose from "mongoose";

const socialMediaQueueSchema = new mongoose.Schema({
  postType: { type: String, enum: ['news', 'event', 'announcement'] },
  postId: mongoose.Schema.Types.ObjectId,
  scheduledAt: Date,
  status: { type: String, enum: ['pending', 'posted', 'failed'], default: 'pending' }
});

export const SocialMediaQueue = mongoose.model('SocialMediaQueue', socialMediaQueueSchema);
