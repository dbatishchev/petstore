import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByUsernameQuery } from './getUserByUsername.query';
import { Inject } from '@nestjs/common';
import { UserRepository as UserRepositoryToken } from '../../../../domain/di.tokens';
import { UserRepository } from '../../../../domain/port/userRepository';
import NotFound from '../../../../common/error/notFound';
import { User } from '../../../../domain/entity/user';

@QueryHandler(GetUserByUsernameQuery)
export default class GetUserByUsernameUseCase
  implements IQueryHandler<GetUserByUsernameQuery>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserByUsernameQuery): Promise<User> {
    const user = await this.userRepository.findByUsername(query.username);
    if (!user) {
      throw new NotFound();
    }

    return user;
  }
}
