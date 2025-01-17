export interface IUserBodyDto {
  name: string;
  email: string;
}

interface IUserDto {
  id: number;
  uuid: string;
  name: string;
  email: string;
  isOnboarded: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  isOnboarded: boolean;
  role: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data: Partial<IUserDto>
  ) {
    this.id = data.uuid!;
    this.name = data.name!;
    this.email = data.email!;
    this.isOnboarded = data.isOnboarded!;
    this.role = data.role!;
    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
