import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema({
  key: String,
  value: String,
  updatedAt: { type: Date, default: Date.now }
});

export const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
