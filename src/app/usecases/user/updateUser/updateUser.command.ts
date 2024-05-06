import { UserDTO } from '../../../dto/user.dto';

export class UpdateUserCommand {
  constructor(public readonly user: UserDTO) {}
}
