import { StatusCodes } from 'http-status-codes';

export class ForbiddenException extends Error {
  status: number;

  constructor() {
    super('Forbidden');
    this.name = 'ForbiddenException';
    this.status = StatusCodes.FORBIDDEN;
  }
}
