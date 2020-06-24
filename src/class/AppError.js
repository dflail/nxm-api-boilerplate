const { UserFacingError } = require('./base/BaseError');
const { errors } = require('../utils/app-data');

class AuthenticationError extends UserFacingError {
  constructor() {
    super(errors.AUTH, 401);
  }
}

class BadRequestError extends UserFacingError {
  constructor(details) {
    super(
      details
        ? `${errors.BAD_REQUEST}${errors.DETAILS}${details}`
        : `${errors.BAD_REQUEST}`,
      400
    );
    this.details = details;
  }
}

class ForbiddenError extends UserFacingError {
  constructor() {
    super(errors.FORBIDDEN, 403);
  }
}

class MongooseError extends UserFacingError {
  constructor(message, details, statusCode) {
    super(
      details ? `${message}${errors.DETAILS}${details}` : `${message}`,
      statusCode
    );
  }
}

class NotFoundError extends UserFacingError {
  constructor(details) {
    super(
      details
        ? `${errors.NOT_FOUND}${errors.DETAILS}${details}`
        : `${errors.NOT_FOUND}`,
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
