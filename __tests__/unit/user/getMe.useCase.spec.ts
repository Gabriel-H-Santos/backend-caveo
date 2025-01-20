import { GetMeUseCase } from '../../../src/core/useCases/user/getMe.useCase';
import { UserRepository } from '../../../src/core/infrastructure/repositories/user.repository';
import { NotFoundException } from '../../../src/shared/exceptions';

const mockUserRepository = {
  findByEmail: jest.fn(),
};

const useCase = new GetMeUseCase(
  mockUserRepository as unknown as UserRepository
);

describe('GetMeUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user', async () => {
    const mockUser = {
      id: 1,
      externalId: '9131fd35-8f46-40ce-b25f-5998e88c31cc',
      email: 'test@example.com',
      isOnboarded: false,
      role: 'user',
      createdAt: '2025-01-19T21:02:18.499Z',
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await useCase.execute('test@example.com');

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com'
    );
  });

  it('should throw a NotFoundException when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute('test@example.com')
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw a generic error if the repository fails', async () => {
    mockUserRepository.findByEmail.mockImplementation(() => {
      throw new Error('Database connection error');
    });

    await expect(
      useCase.execute('test@example.com')
    ).rejects.toThrow('Database connection error');
  });
});