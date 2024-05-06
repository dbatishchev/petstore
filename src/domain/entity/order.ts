import { OrderStatusEnum } from '../../api/openapi/types';
import { Pet } from './pet';

export interface Order {
  id: number;
  pet: Pet;
  quantity: number;
  shipDate: Date;
  status: OrderStatusEnum;
  complete: boolean;
}
