import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUsersCommand } from './createUsers.command';
import { Inject } from '@nestjs/common';
import { UserRepository as UserRepositoryToken } from '../../../../domain/di.tokens';
import { UserRepository } from '../../../../domain/port/userRepository';
import Conflict from '../../../../common/error/conflict';
import { User } from '../../../../domain/entity/user';

@CommandHandler(CreateUsersCommand)
export default class CreateUsersUseCase
  implements ICommandHandler<CreateUsersCommand>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUsersCommand): Promise<User[]> {
    const usernames = command.users.map((user) => user.username);
    const uniqueUsernames = new Set(usernames);
    if (uniqueUsernames.size !== command.users.length) {
      throw new Conflict();
    }

    const existingUsers = await this.userRepository.findByUsernames(usernames);
    if (existingUsers.length > 0) {
      throw new Conflict();
    }

    const users = command.users.map((user) => {
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phone: user.phone,
        userStatus: user.userStatus,
      };
    });

    return this.userRepository.createMany(users);
  }
}
