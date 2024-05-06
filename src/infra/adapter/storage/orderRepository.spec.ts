import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OrderRepository } from './orderRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../typeorm/order.orm';
import { OrderStatusEnum } from '../../../api/openapi/types';
import { Pet } from '../../typeorm/pet.orm';
import { Category } from '../../typeorm/category.orm';
import { Tag } from '../../typeorm/tag.orm';
import { generateOrder } from '../../../../test/generator/generateOrder';
import { generatePet } from '../../../../test/generator/generatePet';
import { TypeormTestingModule } from '../../../../test/setup/typeorm-testing.module';

describe('OrderRepository', () => {
  let module: TestingModule;
  let connection: DataSource;
  let repository: OrderRepository;
  let pet: Pet;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...TypeormTestingModule(),
        TypeOrmModule.forFeature([Order, Pet, Category, Tag]),
      ],
      providers: [OrderRepository],
    }).compile();

    connection = module.get<DataSource>(DataSource);
    repository = module.get<OrderRepository>(OrderRepository);
  });

  afterEach(async () => {
    const orderRepository = connection.getRepository(Order);
    await orderRepository.clear();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
    pet = await connection.manager.save(Pet, generatePet());
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findOrderByID', () => {
    it('should return null if order with given id is not found', async () => {
      const result = await repository.findOrderByID(1);
      expect(result).toBeNull();
    });

    it('should return an Order object if order with given id is found', async () => {
      const order = generateOrder({ pet });
      const insertedOrder = await connection.manager.save(Order, order);

      const result = await repository.findOrderByID(insertedOrder.id);
      expect(result.id).toEqual(insertedOrder.id);
    });
  });

  describe('create', () => {
    it('should create a new order and return it', async () => {
      const order = generateOrder({ pet });
      const createdOrder = await repository.create(order);

      expect(createdOrder.id).toBeDefined();
    });
  });

  describe('deleteByID', () => {
    it('should delete the order with the given id', async () => {
      const order = generateOrder({ pet });
      const insertedOrder = await connection.manager.save(Order, order);

      await repository.deleteByID(insertedOrder.id);

      const result = await repository.findOrderByID(insertedOrder.id);
      expect(result).toBeNull();
    });
  });

  describe('getInventory', () => {
    it('should return the inventory grouped by status', async () => {
      const orders = [
        generateOrder({ pet, status: OrderStatusEnum.Placed }),
        generateOrder({ pet, status: OrderStatusEnum.Placed }),
        generateOrder({ pet, status: OrderStatusEnum.Approved }),
        generateOrder({ pet, status: OrderStatusEnum.Approved }),
        generateOrder({ pet, status: OrderStatusEnum.Approved }),
        generateOrder({ pet, status: OrderStatusEnum.Delivered }),
      ];
      await connection.manager.save(Order, orders);

      const result = await repository.getInventory();

      expect(result).toEqual({
        [OrderStatusEnum.Placed]: 2,
        [OrderStatusEnum.Approved]: 3,
        [OrderStatusEnum.Delivered]: 1,
      });
    });
  });
});
