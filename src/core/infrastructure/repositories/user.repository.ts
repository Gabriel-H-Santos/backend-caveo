import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { PostgresConnection } from '@config/databases/postgres';
import { Service } from 'typedi';
import { errorLog } from '@shared/utils/loggerFormat';
import { IUserRepository } from '@core/domain/interfaces/user.interface';

@Service()
export class UserRepository implements IUserRepository {
  private readonly repository: Repository<User>;

  constructor(private readonly connection: PostgresConnection) {
    this.repository = this.connection.getDataSource().getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      errorLog({ msg: 'Error in UserRepository.findByEmail', error });
      throw error;
    }
  }

  public async save(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      errorLog({ msg: 'Error in UserRepository.save', error });
      throw error;
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      errorLog({ msg: 'Error in UserRepository.findAll', error });
      throw error;
    }
  }

  public async findByUuid(uuid: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { uuid } });
    } catch (error) {
      errorLog({ msg: 'Error in UserRepository.findByUuid', error });
      throw error;
    }
  }
}
