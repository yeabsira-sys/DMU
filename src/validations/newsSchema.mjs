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
  detail: Joi.string(),
  author: Joi.string().required(),
  isHidden: Joi.boolean().optional(),
  socialMediaPosted: Joi.array()
    .items(Joi.string().valid('facebook', 'telegram'))
    .messages({
      'any.only': '{{#label}} must be either facebook or telegram',
      'array.includes': '{{#label}} contains invalid platform'
    }),
  strong: Joi.boolean()
}).unknown(true);

export const editNewsValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  description: Joi.string().required(),
  detail: Joi.string().required(),
  author: Joi.string().required(),
  isHidden: Joi.boolean().required(),
  socialMediaPosted: Joi.array()
    .items(Joi.string().valid('facebook', 'telegram'))
    .messages({
      'any.only': '{{#label}} must be either facebook or telegram',
      'array.includes': '{{#label}} contains invalid platform'
    }),
    imageNames: Joi.array().items(Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
    })),
    imageIds: Joi.array().items(Joi.string().required()),
    formerImages: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        uri: Joi.string().required(),
        name: Joi.string().required(),
        _id: Joi.string().optional(),
      })
    ),
    adminLoked: Joi.boolean().required(),
  cdaLoked: Joi.boolean().required(),
  strong: Joi.boolean().required(),
  imageChanged: Joi.boolean().required(),
})

export const searchNewsValidationSchema = Joi.object({
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  isHidden: Joi.boolean().optional(),
  editedBy: Joi.string().optional(),
  postedBy: Joi.string().optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  description: Joi.string().optional(),
  limit: Joi.number().optional(),
  page: Joi.string().optional(),
  adminLoked: Joi.boolean().optional(),
  cdaLoked: Joi.boolean().optional(),
  socialMediaPosted: Joi.array()
    .items(Joi.string().valid('facebook', 'telegram'))
    .messages({
      'any.only': '{{#label}} must be either facebook or telegram',
      'array.includes': '{{#label}} contains invalid platform'
    }),
})