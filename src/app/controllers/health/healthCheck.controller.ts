import { StatusCodes } from 'http-status-codes';
import { Context } from 'koa';
import { Service } from 'typedi';
import { PostgresConnection } from '@config/databases/postgres';

@Service()
export class HealthCheckController {
  constructor(private readonly postgresConnection: PostgresConnection) { }

  public async live(ctx: Context): Promise<void> {
    try {
      const queryRunner = this.postgresConnection.getDataSource().createQueryRunner();
      await queryRunner.query('SELECT 1');
      await queryRunner.release();
  
      ctx.body = {
        status: 'UP',
        database: 'Connected',
        uptime: process.uptime(),
        version: process.env.npm_package_version || 'unknown',
        timestamp: new Date().toISOString(),
      };
      ctx.status = StatusCodes.OK;
    } catch (error) {
      ctx.body = {
        status: 'DOWN',
        database: 'Disconnected',
        uptime: process.uptime(),
        version: process.env.npm_package_version || 'unknown',
        timestamp: new Date().toISOString(),
      };
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }
  

  public async ready(ctx: Context): Promise<void> {
    try {
      ctx.status = StatusCodes.NO_CONTENT;
    } catch (error) {
      ctx.body = {
        status: 'DOWN',
        error,
      };
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }
}
