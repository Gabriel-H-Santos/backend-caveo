import { AwsCognitoUseCase } from '../../../src/core/useCases/auth/awsCognito.useCase';
import { cognitoProvider } from '../../../src/config/auth/awsCognitoProvider';
import * as crypto from 'crypto';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

jest.mock('../../../src/config/auth/awsCognitoProvider', () => ({
  cognitoProvider: {
    adminCreateUser: jest.fn().mockReturnValue({ promise: jest.fn() }),
    adminSetUserPassword: jest.fn().mockReturnValue({ promise: jest.fn() }),
    adminInitiateAuth: jest.fn().mockReturnValue({ promise: jest.fn() }),
    adminUpdateUserAttributes: jest.fn().mockReturnValue({ promise: jest.fn() }),
  },
}));

jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: {
    create: jest.fn(),
  },
}));

describe('AwsCognitoUseCase', () => {
  const useCase = new AwsCognitoUseCase();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes existentes mantidos
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

  // Novos testes adicionados
  describe('getToken', () => {
    it('should return a token successfully', async () => {
      (cognitoProvider.adminInitiateAuth as jest.Mock).mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({
          AuthenticationResult: { IdToken: 'mockIdToken' },
        }),
      });

      const token = await useCase.getToken('mockExternalId', 'mockPassword');

      expect(token).toBe('mockIdToken');
      expect(cognitoProvider.adminInitiateAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          AuthParameters: {
            USERNAME: 'mockExternalId',
            PASSWORD: 'mockPassword',
            SECRET_HASH: expect.any(String),
          },
        }),
      );
    });

    it('should throw an error if authentication fails', async () => {
      (cognitoProvider.adminInitiateAuth as jest.Mock).mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('Authentication failed')),
      });

      await expect(useCase.getToken('mockExternalId', 'mockPassword')).rejects.toThrow('Authentication failed');
    });
  });

  describe('verifyCognitoToken', () => {
    it('should decode and return token attributes', async () => {
      const mockVerifier = {
        verify: jest.fn().mockResolvedValue({
          'custom:externalId': 'mockExternalId',
          email: 'user@example.com',
          name: 'Test User',
          'custom:userRole': 'USER',
        }),
      };

      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue(mockVerifier as any);

      const result = await useCase.verifyCognitoToken('mockToken');

      expect(result).toEqual({
        externalId: 'mockExternalId',
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
      });
    });

    it('should throw an error if token verification fails', async () => {
      const mockVerifier = {
        verify: jest.fn().mockRejectedValue(new Error('Invalid token')),
      };

      jest.spyOn(CognitoJwtVerifier, 'create').mockReturnValue(mockVerifier as any);

      await expect(useCase.verifyCognitoToken('mockToken')).rejects.toThrow('Invalid token');
    });
  });

  describe('updateCognitoUser', () => {
    it('should update user attributes successfully', async () => {
      (cognitoProvider.adminUpdateUserAttributes as jest.Mock).mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({}),
      });

      await expect(
        useCase.updateCognitoUser({ externalId: 'mockExternalId', name: 'Updated Name', role: 'ADMIN' }),
      ).resolves.not.toThrow();

      expect(cognitoProvider.adminUpdateUserAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          Username: 'mockExternalId',
          UserAttributes: [
            { Name: 'name', Value: 'Updated Name' },
            { Name: 'custom:userRole', Value: 'ADMIN' },
          ],
        }),
      );
    });

    it('should throw an error if update fails', async () => {
      (cognitoProvider.adminUpdateUserAttributes as jest.Mock).mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await expect(
        useCase.updateCognitoUser({ externalId: 'mockExternalId', name: 'Updated Name', role: 'ADMIN' }),
      ).rejects.toThrow('Update failed');
    });
  });
});
