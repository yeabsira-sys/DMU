import Joi from 'joi';

// Joi schema for Newsletter Subscriber validation
export const subscriberValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  subscribedAt: Joi.date().optional,
});
