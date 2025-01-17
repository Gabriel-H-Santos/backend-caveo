import { Context } from 'koa';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { GetUsersUseCase } from '@core/useCases/user/getUsers.useCase';
import { GetMeUseCase } from '@core/useCases/user/getMe.useCase';
import { EditAccountUseCase } from '@core/useCases/user/editAccount.useCase';
import { SignInOrRegisterUseCase } from '@core/useCases/user/signInOrRegister.useCase';
import { errorLog } from '@shared/utils/loggerFormat';
import { IUserBodyDto, UserResponseDto } from '@core/domain/dtos/user.dto';

@Service()
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly editAccountUseCase: EditAccountUseCase,
    private readonly signInOrRegisterUseCase: SignInOrRegisterUseCase
  ) {}

  public async getUsers(ctx: Context): Promise<void> {
    try {
      const users = await this.getUsersUseCase.execute();
      ctx.body = { users };
    } catch (error) {
      const msg = 'Error fetching users';
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      errorLog({ msg, error });
      ctx.body = { message: msg, error };
    }
  }

  public async getMe(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const user = await this.getMeUseCase.execute(userId);

      if (!user) {
        ctx.status = StatusCodes.NOT_FOUND;
        ctx.body = { message: 'User not found' };
        return;
      }

      ctx.body = { user };
    } catch (error) {
      const msg = 'Error fetching user data';
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      errorLog({ msg, error });
      ctx.body = { message: msg, error };
    }
  }

  public async editAccount(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const { name, newRole } = ctx.request.body as { name: string, newRole: string };
      const updatedUser = await this.editAccountUseCase.execute({ userId, name, newRole, role: ctx.state.user.role });

      ctx.body = { message: 'User updated successfully', user: updatedUser };
    } catch (error) {
      const msg = 'Error updating user';
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      errorLog({ msg, error });
      ctx.body = { message: msg, error };
    }
  }

  public async signInOrRegister(ctx: Context): Promise<void> {
    try {
      const { email, name } = ctx.request.body as IUserBodyDto;
      const { user, registerToken } = await this.signInOrRegisterUseCase.execute({ email, name });

      const response = new UserResponseDto(user);

      ctx.body = { message: 'Sign in or register successful', registerToken, response };
    } catch (error) {
      const msg = 'Error during sign in or registration';
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      errorLog({ msg, error });
      ctx.body = { message: msg, error };
    }
  }
}
