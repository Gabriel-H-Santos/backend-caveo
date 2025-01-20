import * as crypto from 'crypto';
import { Service } from 'typedi';
import { env } from '@env/map-env-to-configuration';
import { cognitoProvider } from '@config/auth/awsCognitoProvider';
import { CognitoJwtVerifier } from "aws-jwt-verify";

interface ITokenPayload {
  externalId: string;
  email: string;
  name?: string;
  role: string;
}

const { appClientId, appClientSecret, userPoolId } = env.auth.awsCognito;

@Service()
export class AwsCognitoUseCase {
  private calculateSecretHash(clientId: string, clientSecret: string, username: string): string {
    return crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  };

  public async createUser(payload: ITokenPayload, password: string): Promise<void> {
    const { externalId, email, role } = payload;

    const params = {
      UserPoolId: userPoolId,
      Username: externalId,
      UserAttributes: [
        { Name: 'custom:externalId', Value: externalId },
        { Name: 'email', Value: email },
        { Name: 'custom:userRole', Value: role },
      ],
      MessageAction: 'SUPPRESS',
    };

    await cognitoProvider.adminCreateUser(params).promise();
    await this.setUserPassword(externalId, password);
  }

  private async setUserPassword(username: string, password: string): Promise<void> {
    const params = {
      UserPoolId: userPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    };

    await cognitoProvider.adminSetUserPassword(params).promise();
  }

  public async getToken(externalId: string, password: string): Promise<string> {
    const secretHash = this.calculateSecretHash(appClientId, appClientSecret, externalId);
  
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: appClientId,
      UserPoolId: userPoolId,
      AuthParameters: {
        USERNAME: externalId,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };
  
    try {
      const response = await cognitoProvider.adminInitiateAuth(params).promise();
  
      return response.AuthenticationResult?.IdToken || '';
    } catch (error) {
      throw error;
    }
  };

  public async verifyCognitoToken(token: string): Promise<ITokenPayload> {
    const verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'id',
      clientId: appClientId,
    });

    const decoded = await verifier.verify(token);
  
    return {
      externalId: `${decoded['custom:externalId']}`,
      email: `${decoded.email}`,
      name: `${decoded.name}`,
      role: `${decoded['custom:userRole']}`,
    }
  }

  public async updateCognitoUser(payload: Partial<ITokenPayload>): Promise<void> {
    const { externalId, name, role } = payload;
  
    const userAttributes = [];
  
    if (name) userAttributes.push({ Name: 'name', Value: name });
    if (role) userAttributes.push({ Name: 'custom:userRole', Value: role });
  
    const params = {
      UserPoolId: userPoolId,
      Username: externalId!,
      UserAttributes: userAttributes,
    };
  
    try {
      await cognitoProvider.adminUpdateUserAttributes(params).promise();
    } catch (error) {
      throw error;
    }
  };
}
