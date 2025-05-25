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
  description: Joi.string().optional(),
  isHidden: Joi.boolean(),
  type: Joi.string().optional(),
  department: Joi.string().optional(),
  targetAudience: Joi.array().items(Joi.string()).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  applicationLink: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  contactInfo: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string().uri()).optional(),
  relatedId: objectId.optional(),
  status: Joi.string().valid('published', 'draft', 'archived').default('published'),
  tags: Joi.array().items(Joi.string()).optional(),
  socialMediaPosted: Joi.array()
      .items(Joi.string().valid('facebook', 'telegram'))
      .messages({
        'any.only': '{{#label}} must be either facebook or telegram',
        'array.includes': '{{#label}} contains invalid platform'
      }),
});


export const updateAnnouncementValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  isHidden: Joi.boolean(),
  department: Joi.string().optional(),
  targetAudience: Joi.array().items(Joi.string()).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  applicationLink: Joi.string().uri().optional(),
  location: Joi.string().optional(),
  contactInfo: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string().uri()).optional(),
  status: Joi.string().valid('published', 'draft', 'archived').default('published'),
  tags: Joi.array().items(Joi.string()).optional(),
  isDeleted: Joi.boolean().optional(),
})