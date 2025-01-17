import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';
import { ForbiddenException, NotFoundException } from '@shared/exceptions';
import { Roles } from '@core/domain/enums/roles';

interface EditAccountInput {
  userId: string;
  name?: string;
  newRole?: string;
  role: string;
}

@Service()
export class EditAccountUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(input: EditAccountInput): Promise<User> {
    const { userId, name, newRole, role } = input;

    if (role !== Roles.ADMIN && newRole) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findByUuid(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (name) {
      user.name = name;
      user.isOnboarded = true;
    }

    if (newRole && role === Roles.ADMIN) {
      user.role = newRole;
    }

    return await this.userRepository.save(user);
  }
}
