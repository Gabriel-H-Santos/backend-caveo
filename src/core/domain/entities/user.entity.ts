import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

interface UserProps {
  email: string;
  name: string;
  role: string;
  isOnboarded?: boolean;
}

@Entity({ name: 'users' })
class User {
  constructor(props: UserProps) {
    if (props) {
      this.email = props.email;
      this.name = props.name;
      this.role = props.role;
      this.isOnboarded = props.isOnboarded || false;
    }
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'uuid' })
  uuid: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ name: 'is_onboarded' })
  isOnboarded!: boolean;

  @Column()
  role!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt!: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'deleted_at' })
  deletedAt?: Date;
}

export { User };
