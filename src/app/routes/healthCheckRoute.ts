import Router from '@koa/router';
import { Container } from 'typedi';
import { HealthCheckController } from '@app/controllers/health/healthCheck.controller';

const healthCheckController = Container.get(HealthCheckController);
const healthCheckRouter = new Router();

healthCheckRouter.get('/ready', healthCheckController.ready.bind(healthCheckController));
healthCheckRouter.get('/live', healthCheckController.live.bind(healthCheckController));

export { healthCheckRouter };
