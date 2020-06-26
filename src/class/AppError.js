const { UserFacingError } = require('./base/BaseError');
const { errorOutput } = require('../utils/string-constants');

class AuthenticationError extends UserFacingError {
  constructor() {
    super(errorOutput.AUTH, 401);
  }
}

class BadRequestError extends UserFacingError {
  constructor(details) {
    super(
      details
        ? `${errorOutput.BAD_REQUEST} (${details})`
        : `${errorOutput.BAD_REQUEST}`,
      400
    );
    this.details = details;
  }
}

class ForbiddenError extends UserFacingError {
  constructor() {
    super(errorOutput.FORBIDDEN, 403);
  }
}

class MongooseError extends UserFacingError {
  constructor(message, details, statusCode) {
    super(details ? `${message} (${details})` : `${message}`, statusCode);
  }
}

class NotFoundError extends UserFacingError {
  constructor(details) {
    super(
      details
        ? `${errorOutput.NOT_FOUND} (${details})`
        : `${errorOutput.NOT_FOUND}`,
      404
    );
    this.details = details;
  }
}

module.exports = {
  AuthenticationError,
  BadRequestError,
  ForbiddenError,
  MongooseError,
  NotFoundError,
  errors
};
