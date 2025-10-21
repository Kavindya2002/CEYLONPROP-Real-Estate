import jwt from 'jsonwebtoken';
import { unauthorizedResponse } from '../utils/response.js';
import User from '../models/User.js';

/**
 * Authentication middleware to verify JWT tokens
 */
export const authMiddleware = async (req, res, next) => {
  try {
    let token = '';
    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      unauthorizedResponse(res, 'Access denied. No token provided.');
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '5b8a422a3b50060bfa46a98f79c61b65e476fba0b1fc7deacd0db50e5331c665'
    );
    
    // Find user by id from token
    const user = await User.findById(decoded.id);

    if (!user) {
      unauthorizedResponse(res, 'User not found.');
      return;
    }

    req.user = user;
    
    // Update the role from the token if needed
    if (user.role !== decoded.role) {
      user.role = decoded.role;
    }
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      unauthorizedResponse(res, 'Invalid token.');
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      unauthorizedResponse(res, 'Token expired.');
      return;
    }

    unauthorizedResponse(res, 'Authentication failed.');
  }
};

export default authMiddleware;