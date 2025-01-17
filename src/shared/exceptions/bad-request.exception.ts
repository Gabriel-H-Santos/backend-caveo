import { StatusCodes } from 'http-status-codes';

export class BadRequestException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'BadRequestException';
    this.status = StatusCodes.BAD_REQUEST;
  }
}
