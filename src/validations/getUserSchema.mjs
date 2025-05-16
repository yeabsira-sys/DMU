import Joi from "joi";

export const getUserByID = Joi.object({
  id: Joi.string().length(24).hex().required().label("MongoDB ObjectId"),
});
export const getUserByEmail = Joi.object({
  email: Joi.string().email().required(),
});
export const getUserByPhone = Joi.object({
  phone: Joi.string().pattern(/^(\+251|0)?9\d{8}$/),
});
export const getUserByUserName = Joi.object({
  userName: Joi.string().min(3).max(30),
});
