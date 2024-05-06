import { UserRepository as IUserRepository } from '../../../domain/port/userRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserORMModel } from '../../typeorm/user.orm';
import { Repository as TypeORMStorageLayer } from 'typeorm/repository/Repository';
import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entity/user';
import { UserMapper } from '../../typeorm/mapper/userMapper';
import { In } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserORMModel)
    private userStorage: TypeORMStorageLayer<UserORMModel>,
  ) {}

  async create(user: Omit<User, 'id'>): Promise<User> {
    return await this.userStorage.save(UserMapper.toPersistence(user));
  }

  async createMany(users: Omit<User, 'id'>[]): Promise<User[]> {
    const itemsToSave = users.map((user) => UserMapper.toPersistence(user));
    return await this.userStorage.save(itemsToSave);
  }

  async deleteByUsername(username: string): Promise<void> {
    await this.userStorage.delete({ username });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userStorage.findOneBy({ username });
  }

  async findByUsernames(usernames: string[]): Promise<User[]> {
    return this.userStorage.find({
      where: {
        username: In(usernames),
      },
    });
  }

  async update(pet: User): Promise<User> {
    return await this.userStorage.save(UserMapper.toPersistence(pet));
  }
}
