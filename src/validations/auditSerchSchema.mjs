import Joi from 'joi'

export const auditSearchSchema = Joi.object({
    actor: Joi.string().allow(null).optional(),
    action: Joi.string().allow(null).optional(),
    success: Joi.string().allow(null).optional(),
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    page: Joi.string().allow(null).optional(),
    limit: Joi.string().allow(null).optional(),
    userAgent: Joi.string().allow(null).optional(),
    ip: Joi.string().allow(null).optional()
})