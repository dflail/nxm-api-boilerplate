const { UserFacingError } = require('./base/BaseError');
const { errorOutput } = require('../utils/string-constants');

class AuthenticationError extends UserFacingError {
  constructor() {
    /**
     * @description User authentication error.
     */
    super(errorOutput.AUTH_ERROR, 401);
  }
}

class BadRequestError extends UserFacingError {
  /**
   * @description Error intended to be displayed for non-mongoose bad requests.
   * @param {String} details
   */
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
  /**
   * @description Error to be displayed if permission system is implemented.
   */
  constructor() {
    super(errorOutput.FORBIDDEN, 403);
  }
}

class MongooseError extends UserFacingError {
  /**
   * @description Error thrown primarily for Mongoose Schema errors
   * @param {String} message Stock error message.
   * @param {String} details Specific details about the error.
   * @param {Number} statusCode HTTP status code.
   */
  constructor(message, details, statusCode) {
    super(details ? `${message} (${details})` : `${message}`, statusCode);
  }
}

class NotFoundError extends UserFacingError {
  /**
   * @description Resource not found.
   * @param {String} details Specific details about the error.
   */
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
  errorOutput
};
