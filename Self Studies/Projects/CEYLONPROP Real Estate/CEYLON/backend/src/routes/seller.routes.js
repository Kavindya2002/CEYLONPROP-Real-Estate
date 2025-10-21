import express from 'express';
import sellerController from '../controllers/seller.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { 
  createSellerValidator, 
  updateSellerValidator, 
  updateSellerStatusValidator 
} from '../utils/validators.js';

const router = express.Router();

// Public routes
router.post('/', createSellerValidator, validateRequest, sellerController.createSeller);

// Private routes - require authentication
router.use(authMiddleware);

// Routes for sellers and admins
router.route('/:id')
  .get(sellerController.getSellerById)
  .put(updateSellerValidator, validateRequest, sellerController.updateSeller);

// Admin only routes
router.use(roleMiddleware(['admin']));

// Get all sellers
router.get('/', sellerController.getSellers);

// Delete a seller
router.delete('/:id', sellerController.deleteSeller);

// Update seller status
router.patch(
  '/:id/status',
  updateSellerStatusValidator,
  validateRequest,
  sellerController.updateSellerStatus
);

export default router;