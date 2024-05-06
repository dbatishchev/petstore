import { Order } from '../../src/domain/entity/order';
import { OrderRepository } from '../../src/domain/port/orderRepository';

export class FakeOrderRepository implements OrderRepository {
  private orders: Order[];

  constructor() {
    this.orders = [];
  }

  async findOrderByID(id: number): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    return order || null;
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = { ...order, id: this.orders.length + 1 };
    this.orders.push(newOrder);
    return newOrder;
  }

  async deleteByID(id: number): Promise<void> {
    this.orders = this.orders.filter((o) => o.id !== id);
  }

  async getInventory(): Promise<any> {
    return this.orders.reduce((acc, o: Order) => {
      acc[o.status] = acc[o.status] ? acc[o.status] + 1 : 1;
      return acc;
    }, {});
  }

  clear(): void {
    this.orders = [];
  }
}
