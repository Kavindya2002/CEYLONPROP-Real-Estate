import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiError } from '../middlewares/error.middleware.js';
import { successResponse, notFoundResponse } from '../utils/response.js';

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Public
 */
export const createCustomer = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    interests,
    password,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      throw new ApiError('Customer with this email already exists', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError('User with this email already exists', 400);
    }

    const customer = await Customer.create(
      [{
        firstName,
        lastName,
        email,
        phone,
        address,
        interests,
      }],
      { session }
    );

    await User.create(
      [{
        _id: customer[0]._id,
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: 'customer',
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      'Customer registered successfully',
      {
        _id: customer[0]._id,
        firstName,
        lastName,
        email,
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
 * @desc    Update customer details
 * @route   PUT /api/customers/:id
 * @access  Private/Customer or Admin
 */
export const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;
  
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return notFoundResponse(res, 'Customer');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== customerId) {
    throw new ApiError('Not authorized to update this customer', 403);
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Customer updated successfully', updatedCustomer);
});

/**
 * @desc    Delete a customer
 * @route   DELETE /api/customers/:id
 * @access  Private/Admin
 */
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return notFoundResponse(res, 'Customer');
    }

    await Customer.findByIdAndDelete(customerId).session(session);
    await User.findByIdAndDelete(customerId).session(session);

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 'Customer deleted successfully');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private/Admin
 */
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  return successResponse(res, 'Customers retrieved successfully', customers);
});

/**
 * @desc    Get customer by ID
 * @route   GET /api/customers/:id
 * @access  Private/Admin or Self
 */
export const getCustomerById = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return notFoundResponse(res, 'Customer');
  }

  if (req.user.role !== 'admin' && req.user._id.toString() !== customerId) {
    throw new ApiError('Not authorized to view this customer', 403);
  }

  return successResponse(res, 'Customer retrieved successfully', customer);
});

export default {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
};