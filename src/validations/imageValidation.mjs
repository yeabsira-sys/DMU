import Joi from 'joi';

export const imageValidation = Joi.object({
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
  size: Joi.number().max(20 * 1024 * 1024).optional(),
  originalname: Joi.string().required(),
});
