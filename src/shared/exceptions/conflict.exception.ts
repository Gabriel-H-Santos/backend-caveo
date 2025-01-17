import { StatusCodes } from 'http-status-codes';

export class ConflictException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'ConflictException';
    this.status = StatusCodes.CONFLICT;
  }
}
