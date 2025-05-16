import Joi from 'joi';
import mongoose from 'mongoose';

// Custom ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

// Joi validation schema for Event
export const createEventValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  images: Joi.array().items(Joi.string().uri()), 
  postedBy: objectId.required(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().allow(null),
  editedBy: objectId.allow(null),
});

export const updateEventValidationSchema = Joi.object({
    title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(), 
  postedBy: objectId.optional(),
  isHidden: Joi.boolean(),
  createdAt: Joi.date(),
  editedAt: Joi.date().required(),
  editedBy: objectId.required(),
})