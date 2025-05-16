import Joi from 'joi';

export const authSchema = Joi.object({
  identifier: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().pattern(/^(\+251|0)?9\d{8}$/), 
    Joi.string().min(3).max(30)             
  ).required().label('email, phone, or userName'),

  password: Joi.string()
    .min(8)
    .required()
    .label('password')
});
 

export const passwordChangeSchema = Joi.object({
  userName: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username cannot be empty'
  }),
  
  newPassword: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // At least one lowercase, one uppercase, and one digit
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required'
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});
