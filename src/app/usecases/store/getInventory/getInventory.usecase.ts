import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInventoryQuery } from './getInventory.query';
import { Inject } from '@nestjs/common';
import { OrderRepository as OrderRepositoryToken } from '../../../../domain/di.tokens';
import { OrderRepository } from '../../../../domain/port/orderRepository';

@QueryHandler(GetInventoryQuery)
export default class GetInventoryUseCase
  implements IQueryHandler<GetInventoryQuery>
{
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  execute(query: GetInventoryQuery): Promise<any> {
    return this.orderRepository.getInventory();
  }
}
