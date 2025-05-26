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

export const editCampusSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
  isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).required(),
  imageChanged: Joi.boolean().optional()
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

export const editCampusLifeSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Description must be a string',
  }),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
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
export const editCollegeSchema = Joi.object({
  name: Joi.string().optional().messages({
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
    .optional()
    .messages({
      'any.required': 'Campus reference is required',
    }),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).required(),
  imageChanged: Joi.boolean().optional()
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
    isHidden: Joi.boolean(),

});
export const editDepartmentSchema = Joi.object({
  name: Joi.string().optional().messages({
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
    .optional()
    .messages({
      'any.required': 'School reference is required',
    }),
    isHidden: Joi.boolean(),
    imageIds: Joi.array().items(Joi.string().optional()),
    formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
});

export const officeSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Office name is required',
    'string.base': 'Office name must be a string',
  }),
  location: Joi.string().allow('', null),
  president: Joi.string().allow('', null),
  msg: Joi.string().allow('', null),
  phone: Joi.string()
      .pattern(/^(\+251|0)?9\d{8}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be 10 to 15 digits',
        'any.required': 'Phone number is required'
      }),
  email: Joi.string().email().allow('', null),
  pobox: Joi.string().allow('', null),
  isHidden: Joi.boolean(),

});
export const editOfficeSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'Office name is required',
    'string.base': 'Office name must be a string',
  }),
  location: Joi.string().allow('', null),
  president: Joi.string().allow('', null),
  msg: Joi.string().allow('', null),
  phone: Joi.string()
      .pattern(/^(\+251|0)?9\d{8}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Phone number must be 10 to 15 digits',
        'any.required': 'Phone number is required'
      }),
  email: Joi.string().email().allow('', null),
  pobox: Joi.string().allow('', null),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
});

export const presidentSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
  }),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
  description: Joi.string().allow('', null),
    isHidden: Joi.boolean(),
});
export const editPresidentSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
  }),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().allow(null).optional(),
  description: Joi.string().allow('', null),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
});



export const programSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Program name is required',
    'string.base': 'Program name must be a string'
  }),
  type: Joi.array()
  .items(
    Joi.string()
      .valid('undergraduate', 'postgraduate', 'diploma', 'phd', 'doctorate', 'master', 'bachelor')
      .messages({
        'any.only': 'Each type must be one of: undergraduate, postgraduate, diploma, phd, doctorate, master, bachelor',
        'string.base': 'Each type must be a string',
      })
  )
  .required()
  .messages({
    'array.base': 'Types must be an array',
    'any.required': 'Types field is required',
  }),
  department: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'any.required': 'Department reference is required',
    'string.pattern.base': 'Invalid department ID format'
  }),
    isHidden: Joi.boolean(),
    description: Joi.string().allow('', null)
,});

export const programFilterSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'Program name is required',
    'string.base': 'Program name must be a string'
  }),
  type: Joi.string().optional(),
  departmentName: Joi.string().optional().messages({
    'any.required': 'Department name is required',
    'string.base': 'Department name must be a string'
  }),
  isHidden: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

export const editProgramSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'Program name is required',
    'string.base': 'Program name must be a string'
  }),
  type: Joi.array()
  .items(
    Joi.string()
      .valid('undergraduate', 'postgraduate', 'diploma', 'phd', 'doctorate', 'master', 'bachelor')
      .messages({
        'any.only': 'Each type must be one of: undergraduate, postgraduate, diploma, phd, doctorate, master, bachelor',
        'string.base': 'Each type must be a string',
      })
  )
  .required()
  .messages({
    'array.base': 'Types must be an array',
    'any.required': 'Types field is required',
  }),
  department: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
    'any.required': 'Department reference is required',
    'string.pattern.base': 'Invalid department ID format'
  }),
    isHidden: Joi.boolean(),
    description: Joi.string().allow('', null),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
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
  phone: Joi.string()
      .pattern(/^(\+251|0)?9\d{8}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Phone number must be 10 to 15 digits',
        'any.required': 'Phone number is required'
      }),
    isHidden: Joi.boolean(),
  college: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
    'any.required': 'College reference is required',
    'string.pattern.base': 'Invalid college ID format'
  })
});
export const editSchoolSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'School name is required',
    'string.base': 'School name must be a string'
  }),
  description: Joi.string().allow('', null),
  mission: Joi.string().allow('', null),
  vision: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  phone: Joi.string()
      .pattern(/^(\+251|0)?9\d{8}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Phone number must be 10 to 15 digits',
        'any.required': 'Phone number is required'
      }),
  college: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
    'any.required': 'College reference is required',
    'string.pattern.base': 'Invalid college ID format'
  }),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
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
  }),
  isHidden: Joi.boolean(),
});

export const editStatisticsSchema = Joi.object({
  name: Joi.string().optional().messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string'
  }),
  amount: Joi.number().optional().messages({
    'any.required': 'Amount is required',
    'number.base': 'Amount must be a number'
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive'
  }),
    isHidden: Joi.boolean(),
        imageIds: Joi.array().items(Joi.string().optional()),
        formerImages: Joi.array().items(
          Joi.object({
            id: Joi.string().required(),
            uri: Joi.string().required(),
            name: Joi.string().required(),
            _id: Joi.string().optional(),
          })
        ).optional(),
  imageChanged: Joi.boolean().optional()
});

export const validateSubscriber = Joi.object({
  email: Joi.string().email().required(),
  status: Joi.string().valid('active', 'inactive')
})
