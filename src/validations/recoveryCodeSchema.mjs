import Joi from "joi";

export const recoveryCodeValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
})