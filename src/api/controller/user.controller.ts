import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { User } from '../openapi/types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../app/usecases/user/createUser/createUser.command';
import { CreateUsersCommand } from '../../app/usecases/user/createUsers/createUsers.command';
import { LoginCommand } from '../../app/usecases/user/login/login.command';
import { LogoutCommand } from '../../app/usecases/user/logout/logout.command';
import { GetUserByUsernameQuery } from '../../app/usecases/user/getUserByUsername/getUserByUsername.query';
import { UpdateUserCommand } from '../../app/usecases/user/updateUser/updateUser.command';
import { DeleteUserCommand } from '../../app/usecases/user/deleteUser/deleteUser.command';
import { UserMapper } from '../mapper/userMapper';
import { ValidatorPipe } from '../pipe/validation.pipe';
import { CreateUserReqSchema } from '../validation/createUserReq.schema';
import { CreateUserWithListReqSchema } from '../validation/createUserWithListReq.schema';
import { UpdateUserReqSchema } from '../validation/updateUserReq.schema';
import { HttpExceptionFilter } from '../filter/httpException.filter';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * OpenAPI spec for this endpoint is incorrect; it makes sense to have all (or almost all) fields required for the user
   */
  @Post()
  @UsePipes(new ValidatorPipe<User>(CreateUserReqSchema))
  public async create(@Body() request: User): Promise<User> {
    const result = await this.commandBus.execute(
      new CreateUserCommand(UserMapper.toEventDTO(request)),
    );
    return UserMapper.fromDomain(result);
  }

  /**
   * the OpenAPI spec for this endpoint is incorrect; the response should be an array of Users (?)
   * Maybe it's better to return a list of created users along with a list of errors (if any)
   */
  @Post('/createWithList')
  @UsePipes(new ValidatorPipe<User[]>(CreateUserWithListReqSchema))
  public async createWithList(@Body() request: User[]): Promise<User> {
    const result = await this.commandBus.execute(
      new CreateUsersCommand(request.map(UserMapper.toEventDTO)),
    );
    return result.map(UserMapper.fromDomain);
  }

  @Get('/login')
  public async login(
    @Body() request: { username: string; password: string },
  ): Promise<string> {
    return this.commandBus.execute(new LoginCommand());
  }

  @Get('/logout')
  public async logout(): Promise<void> {
    return this.commandBus.execute(new LogoutCommand());
  }

  @Get('/:username')
  public async getByUsername(
    @Param('username') username: string,
  ): Promise<User> {
    const result = await this.queryBus.execute(
      new GetUserByUsernameQuery(username),
    );
    return UserMapper.fromDomain(result);
  }

  @Put('/:username')
  public async updateUser(
    @Body(new ValidatorPipe<User>(UpdateUserReqSchema)) request: User,
    @Param('username') username: string,
  ): Promise<User> {
    if (!request.username) {
      request.username = username;
    }
    const result = await this.commandBus.execute(
      new UpdateUserCommand(UserMapper.toEventDTO(request)),
    );
    return UserMapper.fromDomain(result);
  }

  @Delete('/:username')
  public async deleteUser(@Param('username') username: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(username));
  }
}
