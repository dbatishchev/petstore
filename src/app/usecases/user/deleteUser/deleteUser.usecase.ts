import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './deleteUser.command';
import { Inject } from '@nestjs/common';
import { UserRepository as UserRepositoryToken } from '../../../../domain/di.tokens';
import { UserRepository } from '../../../../domain/port/userRepository';
import NoContent from '../../../../common/error/noContent';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserUseCase
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<any> {
    const pet = await this.userRepository.findByUsername(command.username);
    if (!pet) {
      throw new NoContent();
    }

    return this.userRepository.deleteByUsername(command.username);
  }
}
