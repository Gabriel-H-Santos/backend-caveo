import { Context, Next } from 'koa';
import { UnauthorizedException, ForbiddenException } from '@shared/exceptions';
import { AwsCognitoUseCase } from '@core/useCases/auth/awsCognito.useCase';

const awsCognitoUseCase = new AwsCognitoUseCase();

export const authMiddleware = (requiredRole?: string) => {
  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing');

    const [, token] = authHeader.split(' ');

    if (!token) 
      throw new UnauthorizedException('Token is missing');

    try {
      const user = await awsCognitoUseCase.verifyCognitoToken(token);

      if (!user) throw new UnauthorizedException('Invalid token');

      ctx.state.user = user;

      if (requiredRole && ctx.state.user.role !== requiredRole)
        throw new ForbiddenException();

      await next();
    } catch (error) {
      throw error;
    }
  };
};
