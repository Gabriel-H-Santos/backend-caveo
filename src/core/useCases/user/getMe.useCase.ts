import { Service } from 'typedi';
import { UserRepository } from '@core/infrastructure/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';
import { NotFoundException } from '@shared/exceptions';

@Service()
export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  public async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new NotFoundException('User not found!');

    return user;
  }
}