import { UserDTO } from '../../../dto/user.dto';

export class CreateUserCommand {
  constructor(public readonly user: UserDTO) {}
}
