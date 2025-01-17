import { StatusCodes } from 'http-status-codes';

export class InternalServerErrorException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'InternalServerErrorException';
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
