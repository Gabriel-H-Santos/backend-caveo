import * as dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});
import * as AWS from 'aws-sdk';
import { env } from '@env/map-env-to-configuration';

const { region, appClientId, userPoolId } = env.awsCognito;

AWS.config.update({ region });

const cognito = new AWS.CognitoIdentityServiceProvider();

export const createCognitoUser = async (email: string, name: string): Promise<void> => {
  const params = {
    UserPoolId: userPoolId,
    Username: email,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'name', Value: name },
    ],
  };

  try {
    await cognito.adminCreateUser(params).promise();
  } catch (error) {
    throw new Error(`Erro ao criar usuário no Cognito: ${error}`);
  }
};

export const getCognitoToken = async (email: string): Promise<string> => {
  const params = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: appClientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: email,
    },
  };

  try {
    const response = await cognito.adminInitiateAuth(params).promise();
    return response.AuthenticationResult?.IdToken || '';
  } catch (error) {
    throw new Error(`Erro ao gerar token no Cognito: ${error}`);
  }
};
