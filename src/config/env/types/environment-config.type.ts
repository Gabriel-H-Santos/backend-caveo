import { TEnvironmentAPIConfig } from './environment-api-config.type';
import { TEnvironmentDatabaseConfig } from './environment-database-config.type';
import { TEnvironmentDocsConfig } from './environment-doc-config.type';
import { TEnvironmentJWTConfig } from './environment-jwt-config.type';

export type TEnvironmentConfig = {
  api: TEnvironmentAPIConfig;
  db: TEnvironmentDatabaseConfig;
  docs: TEnvironmentDocsConfig;
  jwt: TEnvironmentJWTConfig;
};
