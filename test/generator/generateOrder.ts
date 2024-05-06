import { Order } from '../../src/infra/typeorm/order.orm';
import { OrderStatusEnum } from '../../src/api/openapi/types';
import { generatePet } from './generatePet';

export const generateOrder = (partial: Partial<Order> = {}) => {
  const order = new Order();
  order.status = partial.status ?? OrderStatusEnum.Placed;
  order.pet = partial.pet ?? generatePet();
  order.complete = partial.complete ?? false;
  order.shipDate = partial.shipDate ?? new Date();
  order.quantity = partial.quantity ?? 1;
  return order;
};
