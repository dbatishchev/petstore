import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOrderByIdQuery } from './findOrderById.query';
import { Inject } from '@nestjs/common';
import { OrderRepository as OrderRepositoryToken } from '../../../../domain/di.tokens';
import { OrderRepository } from '../../../../domain/port/orderRepository';
import NotFound from '../../../../common/error/notFound';
import { Order } from '../../../../domain/entity/order';

@QueryHandler(FindOrderByIdQuery)
export default class FindOrderByIdUseCase
  implements IQueryHandler<FindOrderByIdQuery>
{
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: FindOrderByIdQuery): Promise<Order> {
    const order = await this.orderRepository.findOrderByID(query.id);
    if (!order) {
      throw new NotFound('Order not found');
    }

    return order;
  }
}
