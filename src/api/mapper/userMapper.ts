import { User } from '../openapi/types';
import { UserDTO } from '../../app/dto/user.dto';
import { User as UserDomain } from '../../domain/entity/user';

export class UserMapper {
  public static toEventDTO(user: User): UserDTO {
    return { ...user };
  }

  public static fromDomain(user: UserDomain): User {
    return {
      ...user,
    };
  }
}
