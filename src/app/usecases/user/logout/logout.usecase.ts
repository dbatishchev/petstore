import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export default class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  execute(command: LogoutCommand): Promise<any> {
    return Promise.resolve();
  }
}
