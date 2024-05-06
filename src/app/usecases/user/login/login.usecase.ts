import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export default class LoginUseCase implements ICommandHandler<LoginCommand> {
  execute(command: LoginCommand): Promise<any> {
    return Promise.resolve();
  }
}
