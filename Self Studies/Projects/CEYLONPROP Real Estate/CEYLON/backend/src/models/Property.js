import { Schema, model } from 'mongoose';

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      house: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    forSale: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    options: {
      parkingSpot: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
    },
    images: {
      type: [String],
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Property', PropertySchema);