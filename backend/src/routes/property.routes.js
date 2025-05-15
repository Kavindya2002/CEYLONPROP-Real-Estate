import express from 'express';
import propertyController from '../controllers/property.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { 
  createPropertyValidator, 
  updatePropertyValidator, 
  updatePropertyAvailabilityValidator 
} from '../utils/validators.js';

const router = express.Router();

// Public routes - get properties and property by ID
router.get('/', propertyController.getProperties);
router.get('/seller/:sellerId', propertyController.getPropertiesBySellerId);
router.get('/:id', propertyController.getPropertyById);

// Private routes - require authentication
router.use(authMiddleware);

// Seller and admin routes
router.use(roleMiddleware(['seller', 'admin']));

// Create property (sellers only)
router.post('/', createPropertyValidator, validateRequest, propertyController.createProperty);

// Update and delete property (only owner or admin)
router.route('/:id')
  .put(updatePropertyValidator, validateRequest, propertyController.updateProperty)
  .delete(propertyController.deleteProperty);

// Update property availability
router.patch(
  '/:id/availability',
  updatePropertyAvailabilityValidator,
  validateRequest,
  propertyController.updatePropertyAvailability
);

export default router;