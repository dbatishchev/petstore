import * as Joi from 'joi';

export const CreateUserReqSchema = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string(),
  phone: Joi.string(),
  userStatus: Joi.number(),
});
