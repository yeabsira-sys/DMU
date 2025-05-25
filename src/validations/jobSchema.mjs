import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

// Joi schema for Job validation
export const ctreatJobValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  postedBy: objectId.required(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().allow(null),
  editedBy: objectId.allow(null),
  socialMediaPosted: Joi.array()
    .items(Joi.string().valid('facebook', 'telegram'))
    .messages({
      'any.only': '{{#label}} must be either facebook or telegram',
      'array.includes': '{{#label}} contains invalid platform'
    }),
});

export const updateJobValidationSchema = Joi.object({
    title: Joi.string().optional(),
  description: Joi.string().optional(),
  postedBy: objectId.optional(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().required(),
  editedBy: objectId.required(),
})
