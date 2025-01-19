import { User } from '@domain/entities/user.entity';
import { UpdateResult } from 'typeorm';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<UpdateResult>;
}
