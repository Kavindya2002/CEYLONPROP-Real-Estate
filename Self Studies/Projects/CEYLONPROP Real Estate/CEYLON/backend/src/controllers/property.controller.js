import Property from '../models/Property.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiError } from '../middlewares/error.middleware.js';
import { successResponse, notFoundResponse } from '../utils/response.js';

/**
 * @desc    Create a new property
 * @route   POST /api/properties
 * @access  Private/Seller
 */
export const createProperty = asyncHandler(async (req, res) => {
  req.body.sellerId = req.user._id;
  const property = await Property.create(req.body);
  return successResponse(res, 'Property created successfully', property, 201);
});

/**
 * @desc    Update property details
 * @route   PUT /api/properties/:id
 * @access  Private/Seller (owner) or Admin
 */
export const updateProperty = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);
  
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  if (req.user.role !== 'admin' && property.sellerId.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to update this property', 403);
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Property updated successfully', updatedProperty);
});

/**
 * @desc    Update property availability
 * @route   PATCH /api/properties/:id/availability
 * @access  Private/Seller (owner) or Admin
 */
export const updatePropertyAvailability = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const { forSale } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  if (req.user.role !== 'admin' && property.sellerId.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to update this property', 403);
  }

  property.forSale = forSale;
  await property.save();

  return successResponse(
    res,
    `Property marked as ${forSale ? 'for sale' : 'not for sale'}`,
    {
      _id: property._id,
      title: property.title,
      forSale: property.forSale,
    }
  );
});

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private/Seller (owner) or Admin
 */
export const deleteProperty = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);
  
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  if (req.user.role !== 'admin' && property.sellerId.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to delete this property', 403);
  }

  await property.deleteOne();
  return successResponse(res, 'Property deleted successfully');
});

/**
 * @desc    Get all properties with filters
 * @route   GET /api/properties
 * @access  Public
 */
export const getProperties = asyncHandler(async (req, res) => {
  const {
    type,
    city,
    minPrice,
    maxPrice,
    forSale,
    sellerId,
    beds,
    baths,
  } = req.query;

  const query = {};

  if (type) query.type = type;
  if (city) query['address.city'] = new RegExp(city, 'i');
  if (minPrice) query.price = { $gte: Number(minPrice) };
  if (maxPrice) {
    query.price = query.price 
      ? { ...query.price, $lte: Number(maxPrice) } 
      : { $lte: Number(maxPrice) };
  }
  if (forSale !== undefined) query.forSale = forSale === 'true';
  if (sellerId) query.sellerId = sellerId;
  if (beds) query.beds = { $gte: Number(beds) };
  if (baths) query.baths = { $gte: Number(baths) };

  const properties = await Property.find(query)
    .populate('sellerId', 'firstName lastName profilePicture');

  return successResponse(res, 'Properties retrieved successfully', properties);
});

/**
 * @desc    Get property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
export const getPropertyById = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId)
    .populate('sellerId', 'firstName lastName profilePicture phone email');
  
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  return successResponse(res, 'Property retrieved successfully', property);
});

/**
 * @desc    Get properties by seller ID
 * @route   GET /api/properties/seller/:sellerId
 * @access  Public
 */
export const getPropertiesBySellerId = asyncHandler(async (req, res) => {
  const sellerId = req.params.sellerId;
  const properties = await Property.find({ sellerId })
    .populate('sellerId', 'firstName lastName profilePicture');

  return successResponse(res, 'Seller properties retrieved successfully', properties);
});

export default {
  createProperty,
  updateProperty,
  updatePropertyAvailability,
  deleteProperty,
  getProperties,
  getPropertyById,
  getPropertiesBySellerId,
};