class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {
  constructor(message, statusCode) {
    super(message);

    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}

module.exports = { ApplicationError, DatabaseError, UserFacingError };
