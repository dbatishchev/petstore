import { OrderStatusEnum } from '../../api/openapi/types';

export type OrderDTO = {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  status?: OrderStatusEnum;
  complete?: boolean;
};
