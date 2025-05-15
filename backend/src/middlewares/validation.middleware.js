import { validationResult } from 'express-validator';
import { ApiError } from './error.middleware.js';

/**
 * Middleware to check for validation errors
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    throw new ApiError('Validation failed', 400, errors.array());
  }
  
  next();
};

export default validateRequest;