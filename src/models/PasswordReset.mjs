import mongoose from 'mongoose'

const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resetToken: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

