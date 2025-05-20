import Joi from "joi";


export const createUserSchema = Joi.object({
    name: Joi.string().min(6).max(60).required(),
    userName: Joi.string().optional(),
    email: Joi.string()
        .email({minDomainSegments: 2}),
    phone: Joi.string()
    .pattern(/^(\+251|0)?9\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 to 15 digits',
      'any.required': 'Phone number is required'
    }),
    password: Joi.string().min(8).optional(),
    role: Joi.string().valid('student', 'admin', 'cda').required(),

})



export const updateUserSchema = Joi.object({
  name: Joi.string().required(),  
  email: Joi.string()
        .email({minDomainSegments: 2}).required(),
  phone: Joi.string().pattern(/^[0-9]{9,15}$/).required()
    .messages({
      'string.pattern.base': 'Phone must be a valid number (9–15 digits)'
    }),

  role: Joi.string().valid('student', 'admin', 'cda').required()
    .messages({
      'any.only': 'Role must be one of student, admin, or cda',
    }),

  status: Joi.string().valid('active', 'suspended'),

  updatedAt: Joi.date(),
  lastLogin: Joi.date().optional(),

  online: Joi.boolean().default(false),
  refreshToken: Joi.string(),
  identifier: Joi.alternatives().try(
      Joi.string().email(),
      Joi.string().pattern(/^(\+251|0)?9\d{8}$/), 
      Joi.string().min(3).max(30)             
    ).required().label('email, phone, or userName')
});

export const suspendUserSchema = Joi.object({
  identifier: Joi.alternatives().try(
      Joi.string().email(),
      Joi.string().pattern(/^(\+251|0)?9\d{8}$/), 
      Joi.string().min(3).max(30)             
    ).required().label('email, phone, or userName')
})

export const recoveryValidation = Joi.object({
  email: Joi.string().email(),
  recoveryCode: Joi.string(),
  recoveryCodeExpires: Joi.date(),
})