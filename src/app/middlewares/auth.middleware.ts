import { Context, Next } from 'koa';
import { UnauthorizedException, ForbiddenException } from '@shared/exceptions';
import { decodeToken } from '@config/auth/jwt';

export const authMiddleware = (requiredRole?: string) => {
  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = decodeToken(token);

      ctx.state.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      if (requiredRole && ctx.state.user.role !== requiredRole) {
        throw new ForbiddenException();
      }

      await next();
    } catch (error) {
      throw error;
    }
  };
};
