import { mongoose } from "../config/db.mjs";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: String, required: true }, // userName, email, or _id
  target: { type: String }, 
  timestamp: { type: Date, default: Date.now },
  changes: { type: Object }, // for updates, include old/new values
  ip: { type: String },
  userAgent: { type: String },
  success: { type: Boolean, default: true },
  meta: { type: Object }
});

export const AuditLogs = mongoose.model('AuditLogs', auditLogSchema)
