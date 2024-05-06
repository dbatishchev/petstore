import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './createUser.command';
import { Inject } from '@nestjs/common';
import { UserRepository as UserRepositoryToken } from '../../../../domain/di.tokens';
import { UserRepository } from '../../../../domain/port/userRepository';
import Conflict from '../../../../common/error/conflict';
import { User } from '../../../../domain/entity/user';

@CommandHandler(CreateUserCommand)
export default class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(
      command.user.username,
    );
    if (existingUser) {
      throw new Conflict('User already exists');
    }

    return this.userRepository.create({
      username: command.user.username,
      firstName: command.user.firstName,
      lastName: command.user.lastName,
      email: command.user.email,
      password: command.user.password,
      phone: command.user.phone,
      userStatus: command.user.userStatus || 1,
    });
  }
}
