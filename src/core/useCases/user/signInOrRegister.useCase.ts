import { IUserBodyDto } from '@core/domain/dtos/user.dto';
import { User } from '@core/domain/entities/user.entity';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { Service } from 'typedi';
import { BadRequestException } from '@shared/exceptions';
import { Roles } from '@core/domain/enums/roles';
import { AwsCognitoUseCase } from '@core/useCases/auth/awsCognito.useCase';

@Service()
export class SignInOrRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsCognitoUseCase: AwsCognitoUseCase,
  ) {}

  public async execute(input: IUserBodyDto): Promise<{ user: User; message: string; token: string }> {
    const { email, password } = input;

    this.validateSignInOrRegisterInput(email, password);

    let user = await this.userRepository.findByEmail(email);
    let token;

    if (!user) {
      const initialRole = Roles.USER;

      user = new User({ email, role: initialRole });
      await this.userRepository.save(user);

      await this.awsCognitoUseCase.createUser({
        externalId: user.externalId,
        email,
        role: initialRole,
      }, password)

      token = await this.awsCognitoUseCase.getToken(user.externalId, password);

      return { user, message: 'Register successful, save your token', token };
    }

    token = await this.awsCognitoUseCase.getToken(user.externalId, password);

    return { user, message: 'Sign in successful, save your token', token };
  }

  private validateSignInOrRegisterInput(email: string, password: string): void {
    if (!email || !password)
      throw new BadRequestException('Email and Password are required!');

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Email and Password must be strings!');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email must be a valid email address!');
    }

    if (password.length < 6 || password.length > 20) {
      throw new BadRequestException('Password must be between 6 and 20 characters long!');
    }
  }
}
