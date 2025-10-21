import express from 'express';
import userRoutes from './user.routes.js';
import sellerRoutes from './seller.routes.js';
import customerRoutes from './customer.routes.js';
import propertyRoutes from './property.routes.js';

const router = express.Router();

// Mount all routes
router.use('/users', userRoutes);
router.use('/sellers', sellerRoutes);
router.use('/customers', customerRoutes);
router.use('/properties', propertyRoutes);

export default router;