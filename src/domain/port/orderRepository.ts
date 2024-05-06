import { Order } from '../entity/order';

export interface OrderRepository {
  findOrderByID(id: number): Promise<Order | null>;
  create(pet: Omit<Order, 'id'>): Promise<Order>;
  deleteByID(id: number): Promise<void>;
  getInventory(): Promise<any>;
}
