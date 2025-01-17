import jwt from 'jsonwebtoken';
import { env } from '@config/env/map-env-to-configuration';
import { UnauthorizedException } from '@shared/exceptions';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const secretKey = env.jwt.secret;
const tokenExpiration = env.jwt.expiration;

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: tokenExpiration,
  });
};

export const decodeToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, secretKey) as TokenPayload;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token')
  }
};
