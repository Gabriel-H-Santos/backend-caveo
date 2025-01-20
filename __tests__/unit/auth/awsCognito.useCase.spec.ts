import { AwsCognitoUseCase } from '../../../src/core/useCases/auth/awsCognito.useCase';
import { cognitoProvider } from '../../../src/config/auth/awsCognitoProvider';
import * as crypto from 'crypto';

jest.mock('../../../src/config/auth/awsCognitoProvider', () => ({
  cognitoProvider: {
    adminCreateUser: jest.fn().mockReturnValue({ promise: jest.fn() }),
    adminSetUserPassword: jest.fn().mockReturnValue({ promise: jest.fn() }),
  },
}));

describe('AwsCognitoUseCase', () => {
  const useCase = new AwsCognitoUseCase();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const payload = { externalId: '1234', email: 'user@example.com', role: 'USER' };
    const password = 'password123';

    await useCase.createUser(payload, password);

    expect(cognitoProvider.adminCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        UserAttributes: expect.arrayContaining([
          { Name: 'custom:externalId', Value: '1234' },
          { Name: 'email', Value: 'user@example.com' },
          { Name: 'custom:userRole', Value: 'USER' },
        ]),
      })
    );
    expect(cognitoProvider.adminSetUserPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        Username: '1234',
        Password: 'password123',
      })
    );
  });

  it('should throw an error if adminCreateUser fails', async () => {
    (cognitoProvider.adminCreateUser as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error('Cognito error')),
    });

    const payload = { externalId: '1234', email: 'user@example.com', role: 'USER' };
    const password = 'password123';

    await expect(useCase.createUser(payload, password)).rejects.toThrow('Cognito error');
    expect(cognitoProvider.adminCreateUser).toHaveBeenCalled();
    expect(cognitoProvider.adminSetUserPassword).not.toHaveBeenCalled();
  });

  it('should throw an error if adminSetUserPassword fails', async () => {
    (cognitoProvider.adminSetUserPassword as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error('Password error')),
    });

    const payload = { externalId: '1234', email: 'user@example.com', role: 'USER' };
    const password = 'password123';

    await expect(useCase.createUser(payload, password)).rejects.toThrow('Password error');
    expect(cognitoProvider.adminCreateUser).toHaveBeenCalled();
  });

  it('should calculate secret hash correctly', () => {
    const clientId = 'mockClientId';
    const clientSecret = 'mockClientSecret';
    const username = 'mockUsername';

    const hash = useCase['calculateSecretHash'](clientId, clientSecret, username);

    const expectedHash = crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');

    expect(hash).toBe(expectedHash);
  });
});
