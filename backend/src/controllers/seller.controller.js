import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiError } from '../middlewares/error.middleware.js';
import { successResponse, notFoundResponse } from '../utils/response.js';

/**
 * @desc    Create a new seller
 * @route   POST /api/sellers
 * @access  Public
 */
export const createSeller = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    identification,
    profilePicture,
    bio,
    socialLinks,
    preferredLanguages,
    business,
    username,
    password,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sellerExists = await Seller.findOne({
      $or: [{ email }, { username }],
    });

    if (sellerExists) {
      throw new ApiError('Seller with this email or username already exists', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError('User with this email already exists', 400);
    }

    const seller = await Seller.create(
      [{
        firstName,
        lastName,
        email,
        phone,
        identification,
        profilePicture,
        bio,
        socialLinks,
        preferredLanguages,
        business,
        username,
        status: 'Pending',
      }],
      { session }
    );

    await User.create(
      [{
        _id: seller[0]._id,
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: 'seller',
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      'Seller registered successfully. Awaiting approval.',
      {
        _id: seller[0]._id,
        firstName,
        lastName,
        email,
        username,
        status: 'Pending',
      },
      201
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Update seller details
 * @route   PUT /api/sellers/:id
 * @access  Private/Seller or Admin
 */
export const updateSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;
  
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== sellerId) {
    throw new ApiError('Not authorized to update this seller', 403);
  }

  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Seller updated successfully', updatedSeller);
});

/**
 * @desc    Delete a seller
 * @route   DELETE /api/sellers/:id
 * @access  Private/Admin
 */
export const deleteSeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return notFoundResponse(res, 'Seller');
    }

    await Seller.findByIdAndDelete(sellerId).session(session);
    await User.findByIdAndDelete(sellerId).session(session);

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 'Seller deleted successfully');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Update seller status
 * @route   PATCH /api/sellers/:id/status
 * @access  Private/Admin
 */
export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const sellerId = req.params.id;

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  seller.status = status;
  await seller.save();

  return successResponse(res, `Seller status updated to ${status}`, {
    _id: seller._id,
    status: seller.status,
  });
});

/**
 * @desc    Get all sellers
 * @route   GET /api/sellers
 * @access  Private/Admin
 */
export const getSellers = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const query = {};
  
  if (status) {
    query.status = status;
  }

  const sellers = await Seller.find(query);
  return successResponse(res, 'Sellers retrieved successfully', sellers);
});

/**
 * @desc    Get seller by ID
 * @route   GET /api/sellers/:id
 * @access  Private/Admin or Self
 */
export const getSellerById = asyncHandler(async (req, res) => {
  const sellerId = req.params.id;

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== sellerId) {
    throw new ApiError('Not authorized to view this seller', 403);
  }

  return successResponse(res, 'Seller retrieved successfully', seller);
});

export default {
  createSeller,
  updateSeller,
  deleteSeller,
  updateSellerStatus,
  getSellers,
  getSellerById,
};