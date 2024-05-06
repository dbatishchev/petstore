import { Order, OrderStatusEnum } from '../types';

export const orderMock: Order = {
  id: 1,
  petId: 1,
  quantity: 7,
  shipDate: '2024-03-06T09:17:32.293Z',
  status: OrderStatusEnum.Placed,
  complete: false,
};
