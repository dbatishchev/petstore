import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderCommand } from './deleteOrder.command';
import { Inject } from '@nestjs/common';
import { OrderRepository as OrderRepositoryToken } from '../../../../domain/di.tokens';
import { OrderRepository } from '../../../../domain/port/orderRepository';
import NoContent from '../../../../common/error/noContent';

@CommandHandler(DeleteOrderCommand)
export default class DeleteOrderUseCase
  implements ICommandHandler<DeleteOrderCommand>
{
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<any> {
    const order = await this.orderRepository.findOrderByID(command.id);
    if (!order) {
      throw new NoContent();
    }
    await this.orderRepository.deleteByID(command.id);
  }
}
