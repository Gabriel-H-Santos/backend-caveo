import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import cors from '@koa/cors';
import routesFile from '@app/routes';
import { Route } from '@core/domain/enums/routes';

type RoutesFile = {
  [key: string]: Router;
};

const routes: RoutesFile = routesFile;
const router = new Router();

Object.keys(routes).forEach(key => {
  router.use(`/api/${Route[key as Route]}`, routes[key].routes());
});

const app = new Koa();
app.use(bodyParser());
app.use(cors({ maxAge: 86400 }));

app.use(router.routes()).use(router.allowedMethods());

export { app };
