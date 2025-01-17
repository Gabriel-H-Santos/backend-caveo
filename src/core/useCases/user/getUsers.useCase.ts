import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';

@Service()
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
