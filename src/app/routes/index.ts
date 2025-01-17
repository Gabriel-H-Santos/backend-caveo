import { usersRouter } from './user.routes';
import { healthCheckRouter } from './healthCheckRoute';

const routesFile = {
  users: usersRouter,
  health: healthCheckRouter,
};

export default routesFile;