import { UserDTO } from '../../../dto/user.dto';

export class CreateUsersCommand {
  constructor(public readonly users: UserDTO[]) {}
}
