class ApplicationError extends Error {
  // constructor() {
  //   super();
  //   Error.captureStackTrace(this, this.constructor);
  // }

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

  set statusCode(code) {
    this._statusCode = code;
  }
}

module.exports = { ApplicationError, DatabaseError, UserFacingError };
