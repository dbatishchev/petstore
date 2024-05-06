import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from './userRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/user.orm';
import { generateUser } from '../../../../test/generator/generateUser';
import { TypeormTestingModule } from '../../../../test/setup/typeorm-testing.module';

describe('UserRepository', () => {
  let module: TestingModule;
  let connection: DataSource;
  let repository: UserRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...TypeormTestingModule(), TypeOrmModule.forFeature([User])],
      providers: [UserRepository],
    }).compile();

    connection = module.get<DataSource>(DataSource);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    const userRepository = connection.getRepository(User);
    await userRepository.clear();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const user = generateUser();
      const createdUser = await repository.create(user);

      expect(createdUser.id).toBeDefined();
    });
  });

  describe('createMany', () => {
    it('should create multiple users and return them', async () => {
      const users = [generateUser(), generateUser()];
      const createdUsers = await repository.createMany(users);

      expect(createdUsers.length).toBe(2);
      expect(createdUsers.every((u) => u.id)).toBeTruthy();
    });
  });

  describe('deleteByUsername', () => {
    it('should delete the user with the given username', async () => {
      const user = generateUser();
      await connection.manager.save(User, user);

      await repository.deleteByUsername(user.username);

      const result = await repository.findByUsername(user.username);
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return null if user with given username is not found', async () => {
      const result = await repository.findByUsername('nonexistinguser');
      expect(result).toBeNull();
    });

    it('should return a User object if user with given username is found', async () => {
      const user = generateUser();
      await connection.manager.save(User, user);

      const result = await repository.findByUsername(user.username);
      expect(result.id).toEqual(user.id);
    });
  });

  describe('update', () => {
    it('should update the given user and return the updated user', async () => {
      const user = generateUser();
      const insertedUser = await connection.manager.save(User, user);

      insertedUser.username = 'UpdatedUsername';
      const updatedUser = await repository.update(insertedUser);

      expect(updatedUser.username).toEqual('UpdatedUsername');
    });
  });
});
