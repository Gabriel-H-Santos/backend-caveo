import { IUserBodyDto } from '@core/domain/dtos/user.dto';
import { User } from '@core/domain/entities/user.entity';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { errorLog } from '@shared/utils/loggerFormat';
import { Service } from 'typedi';
import { generateToken } from '@config/auth/jwt';

@Service()
export class SignInOrRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  public async execute(input: IUserBodyDto): Promise<{ user: User; registerToken: string | null }> {
    const { email, name } = input;

    try {
      let user = await this.userRepository.findByEmail(email);
      let registerToken = null;

      if (!user) {
        user = new User({ email, name, role: 'user' })
        await this.userRepository.save(user);

        registerToken = generateToken({
          id: user.uuid,
          email: user.email,
          // role: user.role,
          role: 'admin',
        });
      }

      return { user, registerToken };
    } catch (error) {
      const msg = 'Error during sign in or registration';
      errorLog({ msg, error });
      throw new Error(msg);
    }
  }
}
