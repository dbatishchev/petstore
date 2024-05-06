import * as Joi from 'joi';

export const UpdateUserReqSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string(),
  phone: Joi.string(),
  userStatus: Joi.number(),
});
