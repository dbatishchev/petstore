import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './placeOrder.command';
import { Inject } from '@nestjs/common';
import {
  OrderRepository as OrderRepositoryToken,
  PetRepository as PetRepositoryToken,
} from '../../../../domain/di.tokens';
import { OrderRepository } from '../../../../domain/port/orderRepository';
import { PetRepository } from '../../../../domain/port/petRepository';
import InvalidArgument from '../../../../common/error/invalidArgument';

@CommandHandler(PlaceOrderCommand)
export default class PlaceOrderUseCase
  implements ICommandHandler<PlaceOrderCommand>
{
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    @Inject(PetRepositoryToken)
    private readonly petRepository: PetRepository,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<any> {
    const { petId } = command.order;
    const pet = await this.petRepository.findPetByID(petId);
    if (!pet) {
      throw new InvalidArgument();
    }

    return await this.orderRepository.create({
      pet: pet,
      quantity: command.order.quantity,
      shipDate: new Date(command.order.shipDate),
      status: command.order.status,
      complete: command.order.complete,
    });
  }
}
