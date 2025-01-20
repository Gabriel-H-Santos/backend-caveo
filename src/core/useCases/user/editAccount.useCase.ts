import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@shared/exceptions';
import { Roles } from '@core/domain/enums/roles';
import { AwsCognitoUseCase } from '@core/useCases/auth/awsCognito.useCase';
import { User } from '@core/domain/entities/user.entity';

interface EditAccountInput {
  email: string;
  name?: string;
  newRole?: string;
  role: string;
}

@Service()
export class EditAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsCognitoUseCase: AwsCognitoUseCase,
  ) {}

  public async execute(input: EditAccountInput): Promise<void> {
    const { email, name, newRole } = input;

    let user = await this.userRepository.findByEmail(email);

    this.validateUpdateUserInput(newRole, name, user);
    
    user = user!;

    if (newRole && user.role === Roles.ADMIN)
      user.role = newRole as Roles;

    if (name) {
      user.name = name;
      user.isOnboarded = true;
      user.updatedAt = new Date();
    }

    await this.userRepository.update(user);

    await this.awsCognitoUseCase.updateCognitoUser({ name: user.name, externalId: user.externalId, role: user.role });
  }

  private validateUpdateUserInput(newRole?: string, name?: string, user?: User | null): void {
    if (!user)
      throw new NotFoundException('User not found!');

    if (name && (typeof name !== 'string' || name.length < 3 || name.length > 30))
      throw new UnprocessableEntityException('Name must be a string between 3 and 30 characters!');

    if (user.role !== Roles.ADMIN && newRole)
      throw new ForbiddenException();

    if (newRole && !Object.values(Roles).includes(newRole.toLocaleLowerCase() as Roles))
      throw new UnprocessableEntityException('Invalid role!');
  }
}
