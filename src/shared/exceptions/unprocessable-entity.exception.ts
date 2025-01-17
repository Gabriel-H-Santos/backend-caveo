import { StatusCodes } from 'http-status-codes';

export class UnprocessableEntityException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'UnprocessableEntityException';
    this.status = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}
