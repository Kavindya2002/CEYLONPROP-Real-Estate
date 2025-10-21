import mongoose from 'mongoose';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Central error handler middleware
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    if (err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      message = `The ${field} '${value}' already exists`;
    }
  } else if (Array.isArray(err) && err.length > 0 && err[0].param) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.map((e) => ({
      field: e.param,
      message: e.msg,
    }));
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;