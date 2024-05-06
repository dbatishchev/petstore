import { DataSourceOptions } from 'typeorm';
import { Category } from '../../src/infra/typeorm/category.orm';
import { Tag } from '../../src/infra/typeorm/tag.orm';
import { Pet } from '../../src/infra/typeorm/pet.orm';
import { Order } from '../../src/infra/typeorm/order.orm';
import { User } from '../../src/infra/typeorm/user.orm';
import { Image } from '../../src/infra/typeorm/image.orm';

const ormConfig: DataSourceOptions = {
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  entities: [Order, Pet, Category, Tag, User, Image],
  synchronize: true,
  logging: false,
};

export default ormConfig;
