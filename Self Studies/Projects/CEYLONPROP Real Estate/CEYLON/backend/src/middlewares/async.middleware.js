/**
 * Async handler to catch errors in async route handlers
 * @param fn - Async route handler function
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  export default asyncHandler;