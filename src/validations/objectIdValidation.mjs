import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');
  export const objectIdValidation = Joi.object({
    _id: objectId,
    id: objectId
  }).xor('_id', 'id')