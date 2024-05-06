import * as Joi from 'joi';

export const FindPetByStatusQuerySchema = Joi.object({
  status: Joi.string().valid('available', 'pending', 'sold'),
});
