import Joi from "joi";

export const deleteUserSchema = Joi.object({
  identifier: Joi.alternatives()
    .try(
      Joi.string().email(),
      Joi.string().pattern(/^(\+251|0)?9\d{8}$/),
      Joi.string().min(3).max(30)
    )
    .required()
    .label("email, phone, or userName"),

  password: Joi.string().min(8).required().label("password"),
});
