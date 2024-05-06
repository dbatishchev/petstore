import { DeleteOrderCommand } from './deleteOrder.command';
import NoContent from '../../../../common/error/noContent';
import DeleteOrderUseCase from './deleteOrder.usecase';
import { FakeOrderRepository } from '../../../../../test/fakes/fakeOrderRepository';
import { Pet } from '../../../../domain/entity/pet';
import { OrderStatusEnum } from '../../../../api/openapi/types';

describe('DeleteOrderUseCase', () => {
  let orderRepository: FakeOrderRepository;
  let deleteOrderUseCase: DeleteOrderUseCase;

  beforeEach(() => {
    orderRepository = new FakeOrderRepository();
    deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
  });

  it('should delete an order if ID exists', async () => {
    const { id: orderId } = await orderRepository.create({
      pet: {} as Pet,
      quantity: 1,
      shipDate: new Date(),
      status: OrderStatusEnum.Placed,
      complete: false,
    });

    const command: DeleteOrderCommand = { id: orderId };
    await deleteOrderUseCase.execute(command);

    expect(await orderRepository.findOrderByID(orderId)).toBeFalsy();
  });

  it('should throw NoContent error if order ID does not exist', async () => {
    const invalidOrderId = 999;

    const command: DeleteOrderCommand = { id: invalidOrderId };
    await expect(deleteOrderUseCase.execute(command)).rejects.toThrow(
      NoContent,
    );
  });
});
