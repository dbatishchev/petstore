import * as Joi from 'joi';

export const CreatePetReqSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.object().keys({
    id: Joi.number(),
    name: Joi.string(),
  }),
  photoUrls: Joi.array().items(Joi.string()).required(),
  tags: Joi.array().items(
    Joi.object().keys({ id: Joi.number(), name: Joi.string() }),
  ),
  status: Joi.string().valid('available', 'pending', 'sold'),
});
