import * as Joi from 'joi';

export const PlaceOrderReqSchema = Joi.object({
  petId: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
  shipDate: Joi.date().required(),
  status: Joi.string().valid('placed', 'approved', 'delivered').required(),
  complete: Joi.boolean().required(),
});
