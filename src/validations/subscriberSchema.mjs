import Joi from 'joi';

// Joi schema for Newsletter Subscriber validation
export const subscriberValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  subscribedAt: Joi.date().optional,
});


export const searchSubscriberSchema = Joi.object({
  limit: Joi.number().greater(0),
  page: Joi.number().greater(0),
  status: Joi.string()
})