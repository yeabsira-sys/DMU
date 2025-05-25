import Joi from "joi";

export const studentsInfoValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  date: Joi.date().optional(),
  file: Joi.array().items( Joi.string()).min(1).required(),
});