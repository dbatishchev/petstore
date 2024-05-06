import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandBus, QueryBus],
      controllers: [StoreController],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
