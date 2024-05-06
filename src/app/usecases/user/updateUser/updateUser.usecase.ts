import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './updateUser.command';
import { Inject } from '@nestjs/common';
import { UserRepository as UserRepositoryToken } from '../../../../domain/di.tokens';
import { UserRepository } from '../../../../domain/port/userRepository';
import { User } from '../../../../domain/entity/user';
import NotFound from '../../../../common/error/notFound';

@CommandHandler(UpdateUserCommand)
export default class UpdateUserUseCase
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findByUsername(
      command.user.username,
    );

    if (!user) {
      throw new NotFound();
    }

    return this.userRepository.update({
      id: command.user.id,
      username: command.user.username,
      firstName: command.user.firstName,
      lastName: command.user.lastName,
      email: command.user.email,
      password: command.user.password,
      phone: command.user.phone,
      userStatus: command.user.userStatus,
    });
  }
}
