import { FindOrderByIdQuery } from './findOrderById.query';
import NotFound from '../../../../common/error/notFound';
import FindOrderByIdUseCase from './findOrderById.usecase';
import { FakeOrderRepository } from '../../../../../test/fakes/fakeOrderRepository';
import { OrderStatusEnum } from '../../../../api/openapi/types';

describe('FindOrderByIdUseCase', () => {
  let orderRepository: FakeOrderRepository;
  let findOrderByIdUseCase: FindOrderByIdUseCase;

  beforeEach(() => {
    orderRepository = new FakeOrderRepository();
    findOrderByIdUseCase = new FindOrderByIdUseCase(orderRepository);
  });

  it('should return order with given ID', async () => {
    const orderId = 1;
    const orderData = {
      id: orderId,
      pet: {} as any,
      quantity: 1,
      shipDate: new Date(),
      status: OrderStatusEnum.Placed,
      complete: false,
    };
    await orderRepository.create(orderData);

    const query: FindOrderByIdQuery = { id: orderId };
    const foundOrder = await findOrderByIdUseCase.execute(query);

    expect(foundOrder).toEqual(orderData);
  });

  it('should throw NotFound error if order ID does not exist', async () => {
    const invalidOrderId = 999;
    const query: FindOrderByIdQuery = { id: invalidOrderId };

    await expect(findOrderByIdUseCase.execute(query)).rejects.toThrow(NotFound);
  });
});
