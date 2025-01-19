import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';
import { Roles } from '@core/domain/enums/roles';
import { ForbiddenException } from '@shared/exceptions';

@Service()
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(email: string): Promise<User[]> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.role !== Roles.ADMIN)
      throw new ForbiddenException();

    return await this.userRepository.findAll();
  }
}
