import mongoose from 'mongoose';
import Joi from 'joi';

export const campusSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
  isHidden: Joi.boolean()
});


export const campusLifeSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
});



export const collegeSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
  location: Joi.string().allow('', null).messages({
    'string.base': 'Location must be a string',
  }),
  campus: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Campus must be a valid ObjectId');
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Campus reference is required',
    }),
});


export const departmentSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
  school: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('School must be a valid ObjectId');
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'School reference is required',
    }),
});

export const officeSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Office name is required',
    'string.base': 'Office name must be a string',
  }),
  location: Joi.string().allow('', null),
  president: Joi.string().allow('', null),
  msg: Joi.string().allow('', null),
  phone: Joi.string().pattern(/^[0-9+()\-\s]+$/).allow('', null).messages({
    'string.pattern.base': 'Phone must contain only digits and symbols like +, -, (, )',
  }),
  email: Joi.string().email().allow('', null),
  pobox: Joi.string().allow('', null)
});

export const presidentSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
  }),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  description: Joi.string().allow('', null),
});



export const programSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Program name is required',
    'string.base': 'Program name must be a string'
  }),
  type: Joi.string().valid('BSc', 'MSc', 'PhD').required().messages({
    'any.only': 'Type must be one of BSc, MSc, or PhD',
    'any.required': 'Type is required'
  }),
  department: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'any.required': 'Department reference is required',
    'string.pattern.base': 'Invalid department ID format'
  })
});


export const schoolSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'School name is required',
    'string.base': 'School name must be a string'
  }),
  description: Joi.string().allow('', null),
  mission: Joi.string().allow('', null),
  vision: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().allow('', null),
  college: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'any.required': 'College reference is required',
    'string.pattern.base': 'Invalid college ID format'
  })
});



export const statisticsSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string'
  }),
  amount: Joi.number().required().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number'
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive'
  })
});
