import * as dotenv from 'dotenv'
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})
import { TEnvironmentConfig } from './types';

export const env: TEnvironmentConfig = {
  api: {
    name: (process.env.API_NAME as string) || 'Backend CAVEO',
    port: parseInt(process.env.API_PORT!),
    environment: process.env.NODE_ENV || 'development',
    loggerOn: process.env.LOGGER_ON === 'true',
  },
  db: {
    dialect: process.env.DIALECT!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    storage: process.env.DB_STORAGE!,
  },
  auth: {
    secret: process.env.AUTH_SECRET!,
  },
  docs: {
    swagger: {
      schemes: process.env.SWAGGER_SCHEMES as string,
      host: process.env.SWAGGER_HOST as string,
      server: process.env.SWAGGER_SERVER as string,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  }
};
