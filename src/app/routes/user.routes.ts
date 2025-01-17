import Router from '@koa/router';
import { Container } from 'typedi';
import { authMiddleware } from '@app/middlewares/auth.middleware';
import { UserController } from '@app/controllers/user/user.controller';

const userController = Container.get(UserController);
const usersRouter = new Router();

usersRouter.post('/auth', userController.signInOrRegister.bind(userController));
usersRouter.get('/me', authMiddleware(), userController.getMe.bind(userController))
usersRouter.patch('/edit-account', authMiddleware(), userController.editAccount.bind(userController))
usersRouter.get('/list', authMiddleware('admin'), userController.getUsers.bind(userController))

export { usersRouter };
