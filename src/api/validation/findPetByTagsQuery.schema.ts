import * as Joi from 'joi';

export const FindPetByTagsQuerySchema = Joi.object({
  tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
});
