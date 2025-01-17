import Router from '@koa/router';
import { Container } from 'typedi';
import { authMiddleware } from '@app/middlewares/auth.middleware';
import { UserController } from '@app/controllers/user/user.controller';
import { Roles } from '@core/domain/enums/roles';

const userController = Container.get(UserController);
const usersRouter = new Router();

usersRouter.post('/auth', userController.signInOrRegister.bind(userController));
usersRouter.get('/me', authMiddleware(), userController.getMe.bind(userController))
usersRouter.patch('/edit-account', authMiddleware(), userController.editAccount.bind(userController))
usersRouter.get('/list', authMiddleware(Roles.ADMIN), userController.getUsers.bind(userController))

export { usersRouter };
