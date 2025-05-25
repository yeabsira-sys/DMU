import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

export const createAnnouncementValidationSchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid('admission', 'event', 'jobopening').required(),
  description: Joi.string().required(),
  department: Joi.string().optional(),
  targetAudience: Joi.array().items(Joi.string()).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  applicationLink: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  contactInfo: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  postedBy: objectId.optional(),
  relatedId: objectId.optional(),
  status: Joi.string().valid('published', 'draft', 'archived').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isHidden: Joi.boolean().optional(),
});

export const updateAnnouncementValidationSchema = Joi.object({
  title: Joi.string().optional(),
  type: Joi.string().valid('admission', 'event', 'jobopening').optional(),
  description: Joi.string().optional(),
  department: Joi.string().optional(),
  targetAudience: Joi.array().items(Joi.string()).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  applicationLink: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  contactInfo: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  postedBy: objectId.optional(),
  relatedId: objectId.optional(),
  status: Joi.string().valid('published', 'draft', 'archived').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isHidden: Joi.boolean().optional(),
});