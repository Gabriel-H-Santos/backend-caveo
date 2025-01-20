import { GetUsersUseCase } from '../../../src/core/useCases/user/getUsers.useCase';
import { UserRepository } from '../../../src/core/infrastructure/repositories/user.repository';
import { ForbiddenException } from '../../../src/shared/exceptions';
import { Roles } from '../../../src/core/domain/enums/roles';

const mockUserRepository = {
  findByEmail: jest.fn(),
  findAll: jest.fn(),
};

const useCase = new GetUsersUseCase(
  mockUserRepository as unknown as UserRepository
);

describe('GetUsersUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users for an admin user', async () => {
    const adminUser = { email: 'admin@example.com', role: Roles.ADMIN };
    const usersList = [
      adminUser,
      { email: 'user1@example.com', role: Roles.USER },
      { email: 'user2@example.com', role: Roles.USER },
    ];

    mockUserRepository.findByEmail.mockResolvedValue(adminUser);
    mockUserRepository.findAll.mockResolvedValue(usersList);

    const result = await useCase.execute('admin@example.com');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('admin@example.com');
    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(usersList);
  });

  it('should throw ForbiddenException for a non-admin user', async () => {
    const nonAdminUser = { email: 'user@example.com', role: Roles.USER };

    mockUserRepository.findByEmail.mockResolvedValue(nonAdminUser);

    await expect(useCase.execute('user@example.com')).rejects.toThrow(ForbiddenException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(mockUserRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException if user does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent@example.com')).rejects.toThrow(ForbiddenException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(mockUserRepository.findAll).not.toHaveBeenCalled();
  });

  it('should handle errors from the repository gracefully', async () => {
    const adminUser = { email: 'admin@example.com', role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(adminUser);
    mockUserRepository.findAll.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(useCase.execute('admin@example.com')).rejects.toThrow('Database error');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('admin@example.com');
    expect(mockUserRepository.findAll).toHaveBeenCalled();
  });
});
