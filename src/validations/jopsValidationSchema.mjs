import Joi from "joi";

export const createJobValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  department: Joi.string().min(2).max(100).required(),
  jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Temporary').required(),
  jobLevel: Joi.string().max(50).optional(),
  description: Joi.string().max(2000).optional(),
  requiredQualifications: Joi.string().max(1000).optional(),
  preferredQualifications: Joi.string().max(1000).optional(),
  experienceRequired: Joi.string().max(500).optional(),
  applicationDeadline: Joi.date().required(),
  postingDate: Joi.date().optional(),
  salaryRange: Joi.string().max(100).optional(),
  location: Joi.string().max(200).optional(),
  applicationProcess: Joi.string().max(1000).optional(),
  applicationLink: Joi.string().uri().optional(),
  documentsRequired: Joi.array().items(Joi.string()).optional(),
  contactEmail: Joi.string().email().optional(),
  jobReferenceCode: Joi.string().max(100).optional(),
  equalOpportunityStatement: Joi.string().max(1000).optional(),
  isHidden: Joi.boolean().optional(),
  socialMediaPosted: Joi.array()
    .items(Joi.string().valid('facebook', 'telegram'))
    .messages({
      'any.only': '{{#label}} must be either facebook or telegram',
      'array.includes': '{{#label}} contains invalid platform'
    }),
});

export const editJobValidationSchema = createJobValidationSchema.fork(
  ['title', 'department', 'jobType', 'applicationDeadline'],
  (schema) => schema.optional()
);

export const searchJobValidationSchema = Joi.object({
  title: Joi.string().optional(),
  department: Joi.string().optional(),
  jobType: Joi.string().optional(),
  jobLevel: Joi.string().optional(),
  isHidden: Joi.boolean().optional(),
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  page: Joi.number().integer().min(1).optional(),
});