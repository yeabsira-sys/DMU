import Joi from 'joi';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

// Joi schema for announcement validation
export const createAnnouncementValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  postedBy: objectId.required(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().allow(null),
  editedBy: objectId.allow(null),
});


export const updateAnnouncementValidationSchema = Joi.object({
    title: Joi.string().optional(),
  content: Joi.string().optional(),
  postedBy: objectId.optional(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().required(),
  editedBy: objectId.required(),
})