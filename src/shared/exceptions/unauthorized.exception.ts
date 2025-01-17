import { StatusCodes } from 'http-status-codes';

export class UnauthorizedException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'UnauthorizedException';
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
