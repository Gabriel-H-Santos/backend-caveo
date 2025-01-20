import { Context } from 'koa';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { GetUsersUseCase } from '@core/useCases/user/getUsers.useCase';
import { GetMeUseCase } from '@core/useCases/user/getMe.useCase';
import { EditAccountUseCase } from '@core/useCases/user/editAccount.useCase';
import { SignInOrRegisterUseCase } from '@core/useCases/user/signInOrRegister.useCase';
import { IUserBodyDto, UserResponseDto } from '@core/domain/dtos/user.dto';
import { errorLog } from '@shared/utils/loggerFormat';

@Service()
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly editAccountUseCase: EditAccountUseCase,
    private readonly signInOrRegisterUseCase: SignInOrRegisterUseCase
  ) {}

  public async signInOrRegister(ctx: Context): Promise<void> {
    try {
      const { email, password } = ctx.request.body as IUserBodyDto;
      const { user, message, token } = await this.signInOrRegisterUseCase.execute({ email, password });

      const userResponse = new UserResponseDto(user);

      ctx.status = StatusCodes.CREATED;
      ctx.body = { message, token, user: userResponse };
    } catch (error: any) {
      const msg = error.message || 'Error during sign in or registration';
      
      ctx.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = { message: msg };
    }
  }

  public async getMe(ctx: Context): Promise<void> {
    try {
      const email = ctx.state.user.email;
      const user = await this.getMeUseCase.execute(email);

      ctx.status = StatusCodes.OK;
      ctx.body = { user };
    } catch (error: any) {
      const msg = error.message || 'Error fetching user data';
      errorLog({ msg, error });
      ctx.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = { message: msg };
    }
  }

  public async getUsers(ctx: Context): Promise<void> {
    try {
      const email = ctx.state.user.email;
      const users = await this.getUsersUseCase.execute(email);

      ctx.status = StatusCodes.OK;
      ctx.body = { users };
    } catch (error: any) {
      const msg = error.message || 'Error fetching users';

      ctx.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = { message: msg };
    }
  }

  public async editAccount(ctx: Context): Promise<void> {
    try {
      const { email, role } = ctx.state.user;
      const { name, role: newRole } = ctx.request.body as { name: string, role: string };
      await this.editAccountUseCase.execute({ email, name, newRole, role });

      ctx.status = StatusCodes.NO_CONTENT;
      ctx.body = { message: 'User updated successfully' };
    } catch (error: any) {
      const msg = error.message || 'Error updating user';

      ctx.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = { message: msg };
    }
  }
}
