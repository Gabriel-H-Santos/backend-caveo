import * as dotenv from 'dotenv'
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})
import { TEnvironmentConfig } from './types/environment-config.type';

export const env: TEnvironmentConfig = {
  api: {
    name: (process.env.API_NAME as string) || 'BACKEND_CAVEO',
    port: parseInt(process.env.API_PORT!),
    environment: process.env.NODE_ENV || 'development',
    loggerOn: process.env.LOGGER_ON === 'true',
  },
  db: {
    dialect: process.env.DB_DIALECT!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    storage: process.env.DB_STORAGE!,
  },
  docs: {
    swagger: {
      schemes: process.env.SWAGGER_SCHEMES as string,
      host: process.env.SWAGGER_HOST as string,
      server: process.env.SWAGGER_SERVER as string,
    },
  },
  auth: {
    awsCognito: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      region: process.env.AWS_REGION as string,
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
      appClientId: process.env.AWS_COGNITO_APP_CLIENT_ID as string,
      appClientSecret: process.env.AWS_COGNITO_APP_CLIENT_SECRET as string,
    },
  }
};
