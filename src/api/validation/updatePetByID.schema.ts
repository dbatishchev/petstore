import * as Joi from 'joi';

export const UpdatePetByIDSchema = Joi.object({
  status: Joi.string().valid('available', 'pending', 'sold'),
  name: Joi.string(),
});
