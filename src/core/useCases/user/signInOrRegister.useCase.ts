import { IUserBodyDto } from '@core/domain/dtos/user.dto';
import { User } from '@core/domain/entities/user.entity';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { errorLog } from '@shared/utils/loggerFormat';
import { Service } from 'typedi';
import { generateToken } from '@config/auth/jwt';
import { BadRequestException, InternalServerErrorException } from '@shared/exceptions';
import { Roles } from '@core/domain/enums/roles';

@Service()
export class SignInOrRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  public async execute(input: IUserBodyDto): Promise<{ user: User; message: string, registerToken?: string | null }> {
    const { email, name } = input;

    if (!email || !name) {
      throw new BadRequestException('Email and name are required');
    }

    try {
      let user = await this.userRepository.findByEmail(email);
      let registerToken;

      if (!user) {
        user = new User({ email, name, role: Roles.USER })
        await this.userRepository.save(user);

        registerToken = generateToken({
          id: user.uuid,
          email: user.email,
          role: user.role,
        });

        return { user, message: 'Register successful, save your token', registerToken };
      }

      return { user, message: 'Sign in successful' };
    } catch (error) {
      const msg = 'Error during sign in or registration';
      errorLog({ msg, error });
      throw new InternalServerErrorException(msg);
    }
  }
}
