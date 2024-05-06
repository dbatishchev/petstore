import { User } from '../../src/domain/entity/user';
import { UserRepository } from '../../src/domain/port/userRepository';

export class FakeUserRepository implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async createMany(users: Omit<User, 'id'>[]): Promise<User[]> {
    const createdUsers: User[] = [];
    for (const user of users) {
      const newUser = await this.create(user);
      createdUsers.push(newUser);
    }
    return createdUsers;
  }

  async deleteByUsername(username: string): Promise<void> {
    this.users = this.users.filter((user) => user.username !== username);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }

  async findByUsernames(usernames: string[]): Promise<User[]> {
    return this.users.filter((user) => usernames.includes(user.username));
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  clear(): void {
    this.users = [];
  }
}
