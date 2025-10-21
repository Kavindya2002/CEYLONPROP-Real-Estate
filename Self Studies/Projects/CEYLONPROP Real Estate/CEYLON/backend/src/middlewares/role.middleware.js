import { forbiddenResponse } from '../utils/response.js';

/**
 * Role-based authorization middleware
 * @param roles - Allowed roles for this endpoint
 */
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      forbiddenResponse(res, 'Access denied: User not authenticated');
      return;
    }

    if (!roles.includes(req.user.role)) {
      forbiddenResponse(
        res,
        `Access denied: Role '${req.user.role}' is not authorized to access this resource`
      );
      return;
    }

    next();
  };
};

export default roleMiddleware;