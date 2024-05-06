import * as Joi from 'joi';
import { CreateUserReqSchema } from './createUserReq.schema';

export const CreateUserWithListReqSchema =
  Joi.array().items(CreateUserReqSchema);
