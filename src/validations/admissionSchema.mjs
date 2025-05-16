import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

export const createAdmissionValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  postedBy: objectId.required(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().allow(null),
  editedBy: objectId.allow(null),
});

export const updateAdmissionValidationSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  isHidden: Joi.boolean().optional(),
  editedAt: Joi.date().required(),
  editedBy: objectId.required(),
})
