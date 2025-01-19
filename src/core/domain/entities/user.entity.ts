import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from '../enums/roles';

interface UserProps {
  email: string;
  name?: string;
  role: Roles;
  isOnboarded?: boolean;
}

@Entity({ name: 'users' })
class User {
  constructor(props: UserProps) {
    if (props) {
      this.email = props.email;
      this.role = props.role;
      this.isOnboarded = props.isOnboarded || false;
    }
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'external_id', unique: true })
  externalId: string = uuidv4();

  @Column()
  name?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'is_onboarded' })
  isOnboarded!: boolean;

  @Column({  type: 'enum', enum: Roles })
  role!: Roles;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'deleted_at' })
  deletedAt?: Date;
}

export { User };
