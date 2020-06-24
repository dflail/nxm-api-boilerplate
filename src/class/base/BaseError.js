class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {
  get statusCode() {
    return this.statusCode;
  }
}

module.exports = { ApplicationError, DatabaseError, UserFacingError };
