import { GetInventoryQuery } from './getInventory.query';
import GetInventoryUseCase from './getInventory.usecase';
import { FakeOrderRepository } from '../../../../../test/fakes/fakeOrderRepository';
import { OrderStatusEnum } from '../../../../api/openapi/types';

describe('GetInventoryUseCase', () => {
  let orderRepository: FakeOrderRepository;
  let getInventoryUseCase: GetInventoryUseCase;

  beforeEach(() => {
    orderRepository = new FakeOrderRepository();
    getInventoryUseCase = new GetInventoryUseCase(orderRepository);
  });

  it('should return the inventory from the order repository', async () => {
    const orders = [
      {
        pet: {} as any,
        quantity: 1,
        shipDate: new Date(),
        status: OrderStatusEnum.Placed,
        complete: false,
      },
      {
        pet: {} as any,
        quantity: 1,
        shipDate: new Date(),
        status: OrderStatusEnum.Placed,
        complete: false,
      },
      {
        pet: {} as any,
        quantity: 1,
        shipDate: new Date(),
        status: OrderStatusEnum.Approved,
        complete: false,
      },
      {
        pet: {} as any,
        quantity: 1,
        shipDate: new Date(),
        status: OrderStatusEnum.Delivered,
        complete: false,
      },
    ];

    for (const order of orders) {
      await orderRepository.create(order);
    }

    const query: GetInventoryQuery = {};
    const inventory = await getInventoryUseCase.execute(query);

    expect(inventory).toEqual({
      approved: 1,
      delivered: 1,
      placed: 2,
    });
  });
});
