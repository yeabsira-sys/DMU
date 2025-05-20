import { mongoose } from "../config/db.mjs";

const userSchema = new mongoose.Schema({
  name: String,
  userName: String,
  email: { type: String, required: true, unique: true },
  phone: {type: String, unique: true},
  password: String,
  role: { type: String, enum: ['student', 'admin', 'cda'], required: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  lastLogin: Date,
  online: {type: String, enum: [true, false], default: false},
  refreshToken: String,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  recoveryCode: { type: String, default: null },
  recoveryCodeExpires: { type: Date, default: null },
});

export const User = mongoose.model('user', userSchema)