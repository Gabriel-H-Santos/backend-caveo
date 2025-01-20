import { EditAccountUseCase } from '../../../src/core/useCases/user/editAccount.useCase';
import { UserRepository } from '../../../src/core/infrastructure/repositories/user.repository';
import { AwsCognitoUseCase } from '../../../src/core/useCases/auth/awsCognito.useCase';
import { ForbiddenException, NotFoundException } from '../../../src/shared/exceptions';
import { Roles } from '../../../src/core/domain/enums/roles';

const mockUserRepository = {
  findByEmail: jest.fn(),
  update: jest.fn(),
};

const mockAwsCognitoUseCase = {
  updateCognitoUser: jest.fn(),
};

const useCase = new EditAccountUseCase(
  mockUserRepository as unknown as UserRepository,
  mockAwsCognitoUseCase as unknown as AwsCognitoUseCase
);

describe('EditAccountUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update user name and role successfully', async () => {
    const mockUser = { email: 'user@example.com', name: 'Old Name', role: Roles.ADMIN, externalId: '1234' };
    const input = { email: 'user@example.com', name: 'New Name', newRole: Roles.USER, role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name', role: Roles.USER })
    );
    expect(mockAwsCognitoUseCase.updateCognitoUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Name', role: Roles.USER })
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const input = { email: 'nonexistent@example.com', name: 'New Name', role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UnprocessableEntityException for invalid name', async () => {
    const mockUser = { email: 'user@example.com', name: 'Old Name', role: Roles.ADMIN };
    const input = { email: 'user@example.com', name: 'a', role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(useCase.execute(input)).rejects.toThrow('Name must be a string between 3 and 30 characters!');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should update only the name if no newRole is provided', async () => {
    const mockUser = { email: 'user@example.com', name: 'Old Name', role: Roles.ADMIN, externalId: '1234' };
    const input = { email: 'user@example.com', name: 'Updated Name', role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await useCase.execute(input);

    expect(mockUserRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Updated Name', role: Roles.ADMIN })
    );
    expect(mockAwsCognitoUseCase.updateCognitoUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Updated Name' })
    );
  });

  it('should handle repository update errors gracefully', async () => {
    const mockUser = { email: 'user@example.com', name: 'Old Name', role: Roles.ADMIN, externalId: '1234' };
    const input = { email: 'user@example.com', name: 'New Name', role: Roles.ADMIN };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserRepository.update.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(useCase.execute(input)).rejects.toThrow('Database error');
    expect(mockAwsCognitoUseCase.updateCognitoUser).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException if a non-admin user tries to change role', () => {
    const user = { role: Roles.USER };
    expect(() => {
      (useCase as any).validateUpdateUserInput('ADMIN', 'Valid Name', user);
    }).toThrow(ForbiddenException);
  });

  it('should throw UnprocessableEntityException if newRole is invalid', () => {
    const user = { role: Roles.ADMIN };
    expect(() => {
      (useCase as any).validateUpdateUserInput('INVALID_ROLE', 'Valid Name', user);
    }).toThrow('Invalid role!');
  });
});
