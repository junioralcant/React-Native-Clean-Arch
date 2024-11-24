export class UnexpectedError extends Error {
  constructor() {
    super();
    this.name = 'UnexpectedError';
    this.message = 'Unexpected error';
  }
}
