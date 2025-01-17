import * as dotenv from 'dotenv'
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})
import { DataSource } from 'typeorm'
import { env } from './src/config/env/map-env-to-configuration'
import { User } from './src/core/domain/entities/user.entity'

const migrationsPath = './src/core/infrastructure/migrations'
const { port, host, username, password, database } = env.db

const dataSource = new DataSource({
  type: 'postgres',
  port,
  host,
  username,
  password,
  database,
  entities: [User],
  synchronize: env.api.environment === 'development' ? true : false,
  migrations: [`${migrationsPath}/*.ts`],
})

export default dataSource; 
