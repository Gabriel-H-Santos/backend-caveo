import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';

@Service()
export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userId: string): Promise<User | null> {
    return await this.userRepository.findByUuid(userId);
  }
}