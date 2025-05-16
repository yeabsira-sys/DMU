import Joi from 'joi';

export const auditLogSchema = Joi.object({
  action: Joi.string().required(),
  actor: Joi.string().required(), 
  target: Joi.string().allow(null).optional(),
  changes: Joi.object().allow(null).optional(), 
  ip: Joi.string().allow(null).ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' }).optional(),
  userAgent: Joi.string().allow(null).optional(),
  success: Joi.boolean().allow(null).optional(),
  meta: Joi.object().allow(null).optional()
});
