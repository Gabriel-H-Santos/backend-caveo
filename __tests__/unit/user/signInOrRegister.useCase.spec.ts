import { SignInOrRegisterUseCase } from '../../../src/core/useCases/user/signInOrRegister.useCase';
import { UserRepository } from '../../../src/core/infrastructure/repositories/user.repository';
import { AwsCognitoUseCase } from '../../../src/core/useCases/auth/awsCognito.useCase';

const mockUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

const mockAwsCognitoUseCase = {
  createUser: jest.fn(),
  getToken: jest.fn(),
};

const useCase = new SignInOrRegisterUseCase(
  mockUserRepository as unknown as UserRepository,
  mockAwsCognitoUseCase as unknown as AwsCognitoUseCase
);

describe('SignInOrRegisterUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user when email does not exist', async () => {
    const mockInput = { email: 'newuser@example.com', password: 'password123' };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockAwsCognitoUseCase.getToken.mockResolvedValue('mockToken');

    const result = await useCase.execute(mockInput);

    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockAwsCognitoUseCase.createUser).toHaveBeenCalled();
    expect(result.message).toBe('Register successful, save your token');
    expect(result.token).toBe('mockToken');
  });

  it('should sign in an existing user', async () => {
    const mockUser = { externalId: '1234', email: 'existinguser@example.com' };
    const mockInput = { email: 'existinguser@example.com', password: 'password123' };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAwsCognitoUseCase.getToken.mockResolvedValue('mockToken');

    const result = await useCase.execute(mockInput);

    expect(mockAwsCognitoUseCase.getToken).toHaveBeenCalled();
    expect(result.message).toBe('Sign in successful, save your token');
    expect(result.token).toBe('mockToken');
  });

  it('should throw an error for invalid email format', async () => {
    const mockInput = { email: 'invalid-email', password: 'password123' };

    await expect(useCase.execute(mockInput)).rejects.toThrow('Invalid email format!');
  });

  it('should throw an error for missing email or password', async () => {
    const mockInput1 = { email: '', password: 'password123' };
    const mockInput2 = { email: 'user@example.com', password: '' };

    await expect(useCase.execute(mockInput1)).rejects.toThrow('Email and Password are required!');
    await expect(useCase.execute(mockInput2)).rejects.toThrow('Email and Password are required!');
  });

  it('should throw BadRequestException if email or password are not strings', () => {
    expect(() => {
      (useCase as any).validateSignInOrRegisterInput(123 as any, 'validPassword');
    }).toThrow('Email and Password must be strings!');
    expect(() => {
      (useCase as any).validateSignInOrRegisterInput('validEmail@example.com', 123 as any);
    }).toThrow('Email and Password must be strings!');
  });

  it('should throw an error for passwords shorter than 6 characters', async () => {
    const mockInput = { email: 'user@example.com', password: '12345' };

    await expect(useCase.execute(mockInput)).rejects.toThrow('Password must be between 6 and 20 characters long!');
  });

  it('should handle repository save errors gracefully', async () => {
    const mockInput = { email: 'newuser@example.com', password: 'password123' };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(useCase.execute(mockInput)).rejects.toThrow('Database error');
  });
});
