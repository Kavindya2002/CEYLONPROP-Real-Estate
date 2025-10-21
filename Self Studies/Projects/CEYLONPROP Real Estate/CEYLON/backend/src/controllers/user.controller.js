import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiError } from '../middlewares/error.middleware.js';
import { successResponse, unauthorizedResponse, notFoundResponse } from '../utils/response.js';

/**
 * Generate JWT token for a user
 * @param user - User object
 */
function generateToken(user) {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 86400,
    algorithm: 'HS256',
  };

  const jwtSecret =
    process.env.JWT_SECRET || '5b8a422a3b50060bfa46a98f79c61b65e476fba0b1fc7deacd0db50e5331c665';

  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, options);
}

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return unauthorizedResponse(res, 'Invalid email or password');
  }

  const token = generateToken(user);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return successResponse(res, 'Login successful', {
    user: userResponse,
    token,
  });
});

/**
 * @desc    Create a new user (admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError('User with this email already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return successResponse(res, 'User created successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, 201);
});

/**
 * @desc    Update user password
 * @route   PUT /api/users/:id/password
 * @access  Private/Admin or Self
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to update this user', 403);
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    return notFoundResponse(res, 'User');
  }

  if (req.user.role !== 'admin') {
    if (!(await user.comparePassword(currentPassword))) {
      return unauthorizedResponse(res, 'Current password is incorrect');
    }
  }

  user.password = newPassword;
  await user.save();

  return successResponse(res, 'Password updated successfully');
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return notFoundResponse(res, 'User');
  }

  await user.deleteOne();
  return successResponse(res, 'User deleted successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return notFoundResponse(res, 'User');
  }

  return successResponse(res, 'User profile retrieved successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export default {
  loginUser,
  createUser,
  updatePassword,
  deleteUser,
  getCurrentUser,
};