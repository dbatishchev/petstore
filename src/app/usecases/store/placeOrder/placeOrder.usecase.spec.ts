import { PlaceOrderCommand } from './placeOrder.command';
import InvalidArgument from '../../../../common/error/invalidArgument';
import PlaceOrderUseCase from './placeOrder.usecase';
import { FakeOrderRepository } from '../../../../../test/fakes/fakeOrderRepository';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { OrderStatusEnum, PetStatusEnum } from '../../../../api/openapi/types';

describe('PlaceOrderUseCase', () => {
  let orderRepository: FakeOrderRepository;
  let petRepository: FakePetRepository;
  let placeOrderUseCase: PlaceOrderUseCase;

  beforeEach(() => {
    orderRepository = new FakeOrderRepository();
    petRepository = new FakePetRepository();
    placeOrderUseCase = new PlaceOrderUseCase(orderRepository, petRepository);
  });

  it('should place an order with valid data', async () => {
    const petId = 1;
    const petData = {
      id: petId,
      name: 'Rex',
      status: PetStatusEnum.Available,
      images: [],
      category: { id: 1, name: 'Dog' },
      tags: [{ id: 1, name: 'tag1' }],
    };
    await petRepository.create(petData);

    const orderData = {
      petId: petId,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: OrderStatusEnum.Placed,
      complete: false,
    };

    const command: PlaceOrderCommand = { order: orderData };
    const result = await placeOrderUseCase.execute(command);

    expect(result).toBeDefined();
    expect(result.pet.id).toEqual(petId);
    expect(result.quantity).toEqual(orderData.quantity);
    expect(result.shipDate.toISOString()).toEqual(orderData.shipDate);
    expect(result.status).toEqual(orderData.status);
    expect(result.complete).toEqual(orderData.complete);
  });

  it('should throw InvalidArgument error if pet ID does not exist', async () => {
    const nonExistingPetId = 999;
    const orderData = {
      petId: nonExistingPetId,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: OrderStatusEnum.Placed,
      complete: false,
    };

    const command: PlaceOrderCommand = { order: orderData };
    await expect(placeOrderUseCase.execute(command)).rejects.toThrow(
      InvalidArgument,
    );
  });
});
