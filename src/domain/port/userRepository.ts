import { User } from '../entity/user';

export interface UserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;
  createMany(user: Omit<User, 'id'>[]): Promise<User[]>;
  deleteByUsername(username: string): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
  findByUsernames(username: string[]): Promise<User[]>;
  update(user: User): Promise<User>;
}
