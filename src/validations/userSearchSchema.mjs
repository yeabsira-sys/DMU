import Joi from 'joi';

export const userSearch = Joi.object({
  id: Joi.string().hex().length(24).optional(), // MongoDB ObjectId format
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^(\+251|0)?9\d{8}$/).optional(), // Basic phone validation
  status: Joi.string().valid('active', 'suspended', 'locked').optional(),

  page: Joi.number().integer().min(1).max(100).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});
