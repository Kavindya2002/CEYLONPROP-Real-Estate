import pkg from 'express';
const { Response } = pkg;


/**
 * Standard API response format
 */

/**
 * Send a success response
 * @param res - Express response object
 * @param message - Success message
 * @param data - Data to send
 * @param statusCode - HTTP status code
 */
export const successResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Send an error response
 * @param res - Express response object
 * @param message - Error message
 * @param errors - Error details
 * @param statusCode - HTTP status code
 */
export const errorResponse = (res, message, errors, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};

/**
 * Create a not found response
 * @param res - Express response object
 * @param entity - Entity name (e.g., 'User', 'Product')
 */
export const notFoundResponse = (res, entity) => {
  return errorResponse(res, `${entity} not found`, null, 404);
};

/**
 * Create an unauthorized response
 * @param res - Express response object
 * @param message - Error message
 */
export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return errorResponse(res, message, null, 401);
};

/**
 * Create a forbidden response
 * @param res - Express response object
 * @param message - Error message
 */
export const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, null, 403);
};