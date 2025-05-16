import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema({
  service: { type: String, enum: ['google', 'sims'] },
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  updatedAt: { type: Date, default: Date.now }
});

export const Integration = mongoose.model('Integration', integrationSchema);
