import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandBus, QueryBus],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
