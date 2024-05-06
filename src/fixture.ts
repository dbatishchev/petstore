import { Category } from './domain/entity/category';
import { Category as CategoryPersistenceModel } from './infra/typeorm/category.orm';
import { Tag } from './domain/entity/tag';
import { Tag as TagPersistenceModel } from './infra/typeorm/tag.orm';
import { Pet } from './domain/entity/pet';
import { Pet as PetPersistenceModel } from './infra/typeorm/pet.orm';
import { OrderStatusEnum, PetStatusEnum } from './api/openapi/types';
import { Order } from './domain/entity/order';
import { Order as OrderPersistenceModel } from './infra/typeorm/order.orm';
import { User } from './domain/entity/user';
import { User as UserPersistenceModel } from './infra/typeorm/user.orm';
import { Image as ImagePersistenceModel } from './infra/typeorm/image.orm';
import { DataSource, EntityManager } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ImageType } from './domain/entity/image';

const addCategory = async (
  manager: EntityManager,
  partial: Partial<Category> = {},
) => {
  return manager.save(CategoryPersistenceModel, {
    name: 'test-category-1',
    ...partial,
  });
};

const addTag = async (manager: EntityManager, partial: Partial<Tag> = {}) => {
  return manager.save(TagPersistenceModel, {
    name: 'test-tag-1',
    ...partial,
  });
};

const addPet = async (manager: EntityManager, partial: Partial<Pet> = {}) => {
  return await manager.save(PetPersistenceModel, {
    name: 'test-1',
    category: {
      name: 'test-category-1',
    },
    photoUrls: [],
    tags: [{ name: 'test-tag-1' }],
    status: PetStatusEnum.Available,
    ...partial,
  });
};

const addOrder = async (
  manager: EntityManager,
  partial: Partial<Order> = {},
) => {
  return await manager.save(OrderPersistenceModel, {
    // petId: 1,
    quantity: 1,
    shipDate: new Date(),
    status: OrderStatusEnum.Placed,
    complete: false,
    ...partial,
  });
};

const addUser = async (manager: EntityManager, partial: Partial<User> = {}) => {
  return await manager.save(UserPersistenceModel, {
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

const addImage = async (manager: EntityManager, url: string) => {
  return await manager.save(ImagePersistenceModel, {
    filename: 'test-image-1',
    path: url,
    mime: 'image/jpeg',
    type: ImageType.External,
    additionalMeta: '',
  });
};

async function run() {
  const app = await NestFactory.create(AppModule);
  const connection = app.get<DataSource>(DataSource);
  const manager = connection.manager;

  const image1 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1546180572-28e937c8128b?q=80&w=600',
  );

  const image2 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1597626133663-53df9633b799?q=80&w=600',
  );

  const image3 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1579168765467-3b235f938439?q=80&w=600',
  );

  const image4 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1623876159473-5e79be88f7ac?q=80&w=600',
  );

  const image5 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1530991671072-ac4f81c2c3c1?q=80&w=600',
  );

  const image6 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1582092755463-1a07bd874dcc?q=80&w=600',
  );

  const image7 = await addImage(
    manager,
    'https://images.unsplash.com/photo-1493548578639-b0c241186eb0?q=80&w=600',
  );

  const category1 = await addCategory(manager, { name: 'cat' });
  const category2 = await addCategory(manager, { name: 'gatto' });
  const tag1 = await addTag(manager, { name: 'kind' });
  const tag2 = await addTag(manager, { name: 'young' });
  const tag3 = await addTag(manager, { name: 'naughty' });
  const tag4 = await addTag(manager, { name: 'sleepy' });

  await addPet(manager, {
    category: category1,
    tags: [tag1, tag2],
    name: 'Felix',
    images: [image1],
  });
  await addPet(manager, {
    category: category1,
    tags: [tag1],
    name: 'Rolo',
    images: [image2],
  });
  await addPet(manager, {
    category: category1,
    tags: [tag1, tag2],
    name: 'Palmer',
    images: [image3],
  });
  await addPet(manager, {
    category: category2,
    tags: [tag1],
    name: 'Mickey',
    images: [image4],
  });
  await addPet(manager, {
    category: category2,
    tags: [tag1, tag2],
    name: 'Dice',
    images: [image5],
  });
  await addPet(manager, {
    category: category2,
    tags: [tag3],
    name: 'Oscar',
    images: [image6],
  });
  await addPet(manager, {
    category: category1,
    tags: [tag4],
    name: 'Albert',
    images: [image7],
  });

  await app.close();
}

run();
