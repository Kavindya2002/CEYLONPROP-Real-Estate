import { Schema, model } from 'mongoose';

const SellerSchema = new Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: true,
    },
    identification: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
    },
    preferredLanguages: {
      type: [String],
      required: true,
    },
    business: {
      name: String,
      registrationNumber: String,
      designation: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model('Seller', SellerSchema);