import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import { DataSource } from 'typeorm';
import { Pet as PetPersistenceModel } from '../src/infra/typeorm/pet.orm';
import { Category as CategoryPersistenceModel } from '../src/infra/typeorm/category.orm';
import { Tag as TagPersistenceModel } from '../src/infra/typeorm/tag.orm';
import { Order as OrderPersistenceModel } from '../src/infra/typeorm/order.orm';
import { User as UserPersistenceModel } from '../src/infra/typeorm/user.orm';
import { Image as ImagePersistenceModel } from '../src/infra/typeorm/image.orm';
import { Tag } from '../src/domain/entity/tag';
import { Pet } from '../src/domain/entity/pet';
import { Category } from '../src/domain/entity/category';
import { OrderStatusEnum, PetStatusEnum } from '../src/api/openapi/types';
import { Order } from '../src/domain/entity/order';
import { User } from '../src/domain/entity/user';

export const useApplication = () => {
  let app: INestApplication;
  let connection: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = app.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    for (const entity of [
      ImagePersistenceModel,
      OrderPersistenceModel,
      PetPersistenceModel,
      TagPersistenceModel,
      CategoryPersistenceModel,
      UserPersistenceModel,
    ]) {
      const repository = connection.getRepository(entity.name);
      await repository.delete({});
      // await repository.clear(); todo TypeORM works pretty weird with clear() method if you use Postgres; it doesn't use "CASCADE" and there is no way to enable it
    }
  });

  afterAll(async () => {
    await app.close();
  });

  let categoryCounter = 1;
  const addCategory = async (partial: Partial<Category> = {}) => {
    return connection.manager.save(CategoryPersistenceModel, {
      name: `test-category-${categoryCounter++}`,
      ...partial,
    });
  };

  let tagCounter = 1;
  const addTag = async (partial: Partial<Tag> = {}) => {
    return connection.manager.save(TagPersistenceModel, {
      name: `test-tag-${tagCounter++}`,
      ...partial,
    });
  };

  let petCounter = 1;
  const addPet = async (partial: Partial<Pet> = {}) => {
    return await connection.manager.save(PetPersistenceModel, {
      name: 'test-1',
      category: {
        name: `test-category-${petCounter++}`,
      },
      photoUrls: [],
      tags: [{ name: `test-tag-${petCounter++}` }],
      status: PetStatusEnum.Available,
      ...partial,
    });
  };

  const addOrder = async (partial: Partial<Order> = {}) => {
    return await connection.manager.save(OrderPersistenceModel, {
      // petId: 1,
      quantity: 1,
      shipDate: new Date(),
      status: OrderStatusEnum.Placed,
      complete: false,
      ...partial,
    });
  };

  const addUser = async (partial: Partial<User> = {}) => {
    return await connection.manager.save(UserPersistenceModel, {
      username: 'test-user',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'password',
      phone: '123456789',
      userStatus: 1,
      ...partial,
    });
  };

  return () => ({ app, addCategory, addTag, addPet, addOrder, addUser });
};
