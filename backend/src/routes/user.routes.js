import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { loginValidator, createUserValidator, updatePasswordValidator } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/login', loginValidator, validateRequest, userController.loginUser);

// Private routes - require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Update password (user can update their own password)
router.put('/:id/password', updatePasswordValidator, validateRequest, userController.updatePassword);

// Admin only routes
router.use(roleMiddleware(['admin']));

// Create a new user (admin only)
router.post('/', createUserValidator, validateRequest, userController.createUser);

// Delete a user (admin only)
router.delete('/:id', userController.deleteUser);

export default router;