export class SessionExpiredError extends Error {
  constructor() {
    super();
    this.name = 'SessionExpiredError';
    this.message = 'Session expired';
  }
}
