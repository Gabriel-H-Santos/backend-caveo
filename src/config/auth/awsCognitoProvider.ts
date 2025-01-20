// import * as crypto from 'crypto';
// import * as AWS from 'aws-sdk';
// import { env } from '@env/map-env-to-configuration';
// import { CognitoJwtVerifier } from "aws-jwt-verify";
// import { Service } from 'typedi';

// const { 
//   appClientId, 
//   userPoolId, 
//   appClientSecret,
//   region,
//   accessKeyId,
//   secretAccessKey,
// } = env.auth.awsCognito;

// AWS.config.update({
//   accessKeyId,
//   secretAccessKey,
//   region,
// });

// interface ITokenPayload {
//   externalId: string;
//   email: string;
//   name?: string;
//   role: string;
// }

// @Service()
// export class AwsCognitoService {
//   private cognito: AWS.CognitoIdentityServiceProvider;

//   constructor() {
//     this.cognito = new AWS.CognitoIdentityServiceProvider();
//   }

//   private calculateSecretHash(clientId: string, clientSecret: string, username: string): string {
//     return crypto
//       .createHmac('SHA256', clientSecret)
//       .update(username + clientId)
//       .digest('base64');
//   };

//   public async createUser(payload: ITokenPayload, password: string): Promise<void> {
//     const { externalId, email, role } = payload;
  
//     const createUserParams = {
//       UserPoolId: userPoolId,
//       Username: externalId,
//       UserAttributes: [
//         { Name: 'custom:externalId', Value: externalId },
//         { Name: 'email', Value: email },
//         { Name: 'custom:userRole', Value: role },
//       ],
//       MessageAction: 'SUPPRESS',
//     };
  
//     try {
//       await this.cognito.adminCreateUser(createUserParams).promise();
//       await this.setUserPassword(externalId!, password);
//     } catch (error) {
//       throw error;
//     }
//   };

//   private async setUserPassword(externalId: string, password: string): Promise<void> {
//     try {
//       const params = {
//         UserPoolId: userPoolId,
//         Username: externalId,
//         Password: password,
//         Permanent: true,
//       };
  
//       await this.cognito.adminSetUserPassword(params).promise();
//     } catch (error) {
//       throw error;
//     }
//   };

//   public async getToken(externalId: string, password: string): Promise<string> {
//     const secretHash = this.calculateSecretHash(appClientId, appClientSecret, externalId);
  
//     const params = {
//       AuthFlow: 'ADMIN_NO_SRP_AUTH',
//       ClientId: appClientId,
//       UserPoolId: userPoolId,
//       AuthParameters: {
//         USERNAME: externalId,
//         PASSWORD: password,
//         SECRET_HASH: secretHash,
//       },
//     };
  
//     try {
//       const response = await this.cognito.adminInitiateAuth(params).promise();
  
//       return response.AuthenticationResult?.IdToken || '';
//     } catch (error) {
//       throw error;
//     }
//   };

//   public async verifyCognitoToken(token: string): Promise<ITokenPayload> {
//     try {
//       const verifier = CognitoJwtVerifier.create({
//         userPoolId,
//         tokenUse: 'id',
//         clientId: appClientId,
//       });
  
//       const decoded = await verifier.verify(token);
    
//       return {
//         externalId: `${decoded['custom:externalId']}`,
//         email: `${decoded.email}`,
//         name: `${decoded.name}`,
//         role: `${decoded['custom:userRole']}`,
//       }
//     }
//     catch (error) {
//       throw error;
//     }
//   };

//   public async updateCognitoUser(payload: Partial<ITokenPayload>): Promise<void> {
//     const { externalId, name, role } = payload;
  
//     const userAttributes = [];
  
//     if (name) userAttributes.push({ Name: 'name', Value: name });
//     if (role) userAttributes.push({ Name: 'custom:userRole', Value: role });
  
//     const params = {
//       UserPoolId: userPoolId,
//       Username: externalId!,
//       UserAttributes: userAttributes,
//     };
  
//     try {
//       await this.cognito.adminUpdateUserAttributes(params).promise();
//     } catch (error) {
//       throw error;
//     }
//   };
// }
import * as AWS from 'aws-sdk';
import { env } from '@env/map-env-to-configuration';

const {
  region,
  accessKeyId,
  secretAccessKey,
} = env.auth.awsCognito;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

export const cognitoProvider = new AWS.CognitoIdentityServiceProvider();