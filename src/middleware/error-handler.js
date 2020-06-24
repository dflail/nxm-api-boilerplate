const { MongooseError } = require('../class/AppError');
const { errors } = require('../utils/app-data');
const { logError } = require('../utils/console-utils');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // console.log(err);

  if (err.name === 'CastError') {
    error = new MongooseError(errors.NOT_FOUND, errors.CAST_ERROR, 404);
  }

  if (err.name === 'ValidationError') {
    let message = Object.values(err.errors).map(val => val.message);
    error = new MongooseError(message, null, 400);
  }

  if (err.code === 11000) {
    error = new MongooseError(errors.MONGOOSE_DUPLICATE, null, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || errors.INTERNAL
  });

  logError(error);
};

module.exports = errorHandler;
