import { TEnvironmentAPIConfig } from './environment-api-config.type';
import { TEnvironmentAuthConfig } from './environment-auth-config.type';
import { TEnvironmentDatabaseConfig } from './environment-database-config.type';
import { TEnvironmentDocsConfig } from './environment-doc-config.type';

export type TEnvironmentConfig = {
  api: TEnvironmentAPIConfig;
  db: TEnvironmentDatabaseConfig;
  docs: TEnvironmentDocsConfig;
  auth: TEnvironmentAuthConfig;
};
