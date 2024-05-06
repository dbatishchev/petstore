import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './typeorm/category.orm';
import { Tag } from './typeorm/tag.orm';
import { Pet } from './typeorm/pet.orm';
import { Image } from './typeorm/image.orm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';
import {
  PetRepository as PetRepositoryToken,
  OrderRepository as OrderRepositoryToken,
  UserRepository as UserRepositoryToken,
  CategoryRepository as CategoryRepositoryToken,
  TagRepository as TagRepositoryToken,
  ImageRepository as ImageRepositoryToken,
} from '../domain/di.tokens';
import { PetRepository } from './adapter/storage/petRepository';
import { UserRepository } from './adapter/storage/userRepository';
import { OrderRepository } from './adapter/storage/orderRepository';
import { CategoryRepository } from './adapter/storage/categoryRepository';
import { TagRepository } from './adapter/storage/tagRepository';
import { ImageRepository } from './adapter/storage/imageRepository';
import { Order } from './typeorm/order.orm';
import { User } from './typeorm/user.orm';
import { MulterModule } from '@nestjs/platform-express';

const repositories = [
  {
    provide: PetRepositoryToken,
    useClass: PetRepository,
  },
  {
    provide: OrderRepositoryToken,
    useClass: OrderRepository,
  },
  {
    provide: UserRepositoryToken,
    useClass: UserRepository,
  },
  {
    provide: CategoryRepositoryToken,
    useClass: CategoryRepository,
  },
  {
    provide: TagRepositoryToken,
    useClass: TagRepository,
  },
  {
    provide: ImageRepositoryToken,
    useClass: ImageRepository,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [join(__dirname, '**', '*.orm.{ts,js}')],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Category, Tag, Pet, Order, User, Image]),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class InfraModule {}
