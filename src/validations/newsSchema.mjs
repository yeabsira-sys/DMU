import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

export const createNewsValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  description: Joi.string(),
  author: Joi.string().required(),
  isHidden: Joi.boolean().optional(),
  socialMediaPosted: Joi.boolean().optional(),
  strong: Joi.boolean()
});

export const editNewsValidationSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  description: Joi.string(),
  author: Joi.string().optional(),
  isHidden: Joi.boolean().optional(),
  socialMediaPosted: Joi.boolean().optional(),
  editedAt: Joi.date().required(),
  editedBy: objectId.required(),
})
