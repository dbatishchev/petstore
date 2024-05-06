import { OrderRepository as IOrderRepository } from '../../../domain/port/orderRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Order as OrderORMModel } from '../../typeorm/order.orm';
import { Repository as TypeORMStorageLayer } from 'typeorm/repository/Repository';
import { Order } from '../../../domain/entity/order';
import { OrderMapper } from '../../typeorm/mapper/orderMapper';
import { Injectable } from '@nestjs/common';
import { OrderStatusEnum } from '../../../api/openapi/types';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderORMModel)
    private orderStorage: TypeORMStorageLayer<OrderORMModel>,
  ) {}

  async findOrderByID(id: number): Promise<Order | null> {
    const result = await this.orderStorage.findOneBy({ id });

    if (!result) {
      return null;
    }

    return OrderMapper.toDomain(result);
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const result = await this.orderStorage.save(
      OrderMapper.toPersistence(order),
    );
    return OrderMapper.toDomain(result);
  }

  async deleteByID(id: number): Promise<void> {
    await this.orderStorage.delete(id);
  }

  async getInventory(): Promise<{ [status: string]: number }> {
    const raw = await this.orderStorage
      .createQueryBuilder('order')
      .select('order.status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const result = raw.reduce((acc, item) => {
      acc[item['order_status']] = Number(item.count);
      return acc;
    }, {});

    for (const statusKey of Object.keys(OrderStatusEnum)) {
      const status = OrderStatusEnum[statusKey];
      if (!result[status]) {
        result[status] = 0;
      }
    }

    return result;
  }
}
