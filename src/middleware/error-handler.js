const { MongooseError } = require('../class/AppError');
const { errorOutput } = require('../utils/string-constants');
const { logError } = require('../utils/console-utils');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.name = err.name;
  error.message = err.message;
  error.statusCode = err.statusCode;

  if (err.name === 'CastError') {
    error = new MongooseError(errorOutput.NOT_FOUND, err.message, 404);
  }

  if (err.name === 'ValidationError') {
    let message = Object.values(err.errors).map(val => val.message);
    error = new MongooseError(message, null, 400);
  }

  if (err.code === 11000) {
    error = new MongooseError(errorOutput.MONGOOSE_DUPLICATE, err.message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || errorOutput.INTERNAL
  });

  logError(error);
};

module.exports = errorHandler;
