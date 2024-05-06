import * as Joi from 'joi';
import { CreatePetReqSchema } from './createPetReq.schema';

export const UpdatePetReqSchema = CreatePetReqSchema.keys({
  id: Joi.number().required(),
});
