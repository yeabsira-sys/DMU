import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');
export const admissionSchema = Joi.object({
  name: Joi.string().required(),
  degreeLevel: Joi.string().valid('Undergraduate', 'Postgraduate', 'PhD').required(),
  department: Joi.string().required(),
  description: Joi.string().allow(''),
  eligibilityRequirements: Joi.string().allow(''),
  admissionCriteria: Joi.string().allow(''),
  applicationStartDate: Joi.date().required(),
  applicationDeadline: Joi.date().required(),
  modeOfStudy: Joi.string().valid('Full-time', 'Part-time', 'Online'),
  duration: Joi.string().allow(''),
  tuitionFees: Joi.string().allow(''),
  scholarshipInfo: Joi.string().allow(''),
  applicationLink: Joi.string().uri().allow(''),
  contactInfo: Joi.string().allow(''),
  campusLocation: Joi.string().allow(''),
  programCode: Joi.string().allow(''),
  requiredDocuments: Joi.array().items(Joi.string()),
  faq: Joi.string().allow(''),
  isActive: Joi.boolean().allow(''),
});

export const editAdmissionSchema = Joi.object({
  name: Joi.string().required(),
  degreeLevel: Joi.string().valid('Undergraduate', 'Postgraduate', 'PhD').required(),
  department: Joi.string().required(),
  description: Joi.string().allow(''),
  eligibilityRequirements: Joi.string().allow(''),
  admissionCriteria: Joi.string().allow(''),
  applicationStartDate: Joi.date().required(),
  applicationDeadline: Joi.date().required(),
  modeOfStudy: Joi.string().valid('Full-time', 'Part-time', 'Online'),
  duration: Joi.string().allow(''),
  tuitionFees: Joi.string().allow(''),
  scholarshipInfo: Joi.string().allow(''),
  applicationLink: Joi.string().uri().allow(''),
  contactInfo: Joi.string().allow(''),
  campusLocation: Joi.string().allow(''),
  programCode: Joi.string().allow(''),
  requiredDocuments: Joi.array().items(Joi.string()),
  faq: Joi.string().allow(''),
  isActive: Joi.boolean().allow(''),
      imageNames: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      })).optional(),
      imageIds: Joi.array().items(Joi.string().optional()),
      formerImages: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          uri: Joi.string().required(),
          name: Joi.string().required(),
          _id: Joi.string().optional(),
        })
      ).required(),
    imageChanged: Joi.boolean().required(),
    socialMediaPosted: Joi.array()
        .items(Joi.string().valid('facebook', 'telegram'))
        .messages({
          'any.only': '{{#label}} must be either facebook or telegram',
          'array.includes': '{{#label}} contains invalid platform'
        }),
});
