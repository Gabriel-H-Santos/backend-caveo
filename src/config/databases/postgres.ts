import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});
import { DataSource } from 'typeorm';
import { Service } from 'typedi';
import { env } from '@env/map-env-to-configuration';
import { User } from '@core/domain/entities/user.entity';
import { IDatabase } from '@core/domain/interfaces/database.interface';
import { infoLog, errorLog } from '@shared/utils/loggerFormat';

const basePath = path.join(__dirname, '@core/infrastructure', 'migrations/**/*{.ts,.js}');

@Service()
class PostgresConnection implements IDatabase {
  private dataSource: DataSource;

  constructor() {
    const { port, host, username, password, database } = env.db;

    this.dataSource = new DataSource({
      type: 'postgres',
      port,
      host,
      username,
      password,
      database,
      entities: [User],
      migrations: [basePath],
      migrationsRun: true,
      logging: false
    });
  }

  async connectDatabase(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        infoLog({ msg: 'Postgres connected!' });
      }
    } catch (error) {
      errorLog({ msg: 'Error while connecting to Postgres', error });
      process.exit(1);
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}

export { PostgresConnection };
