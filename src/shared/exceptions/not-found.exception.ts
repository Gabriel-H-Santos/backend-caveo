import { StatusCodes } from 'http-status-codes';

export class NotFoundException extends Error {
  status: number;

  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = 'NotFoundException';
    this.status = StatusCodes.NOT_FOUND;
  }
}
