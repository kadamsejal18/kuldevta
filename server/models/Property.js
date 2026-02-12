import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    type: {
      type: String,
      required: [true, 'Please specify rent or buy'],
      enum: ['rent', 'buy'],
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Warehouse'],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    advertised: {
      type: Boolean,
      default: false,
    },
    adStartDate: {
      type: Date,
    },
    adEndDate: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Additional useful fields
    area: {
      type: Number,
      min: [0, 'Area cannot be negative'],
    },
    bedrooms: Number,
    bathrooms: Number,
    address: String,
    amenities: [String],
    contact: {
      name: String,
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
propertySchema.index({ city: 1, type: 1, category: 1 });
propertySchema.index({ featured: 1, active: 1 });
propertySchema.index({ advertised: 1, adStartDate: 1, adEndDate: 1 });
propertySchema.index({ views: -1 });

// Method to check if ad is currently active
propertySchema.methods.isAdActive = function () {
  if (!this.advertised) return false;
  const now = new Date();
  return this.adStartDate <= now && this.adEndDate >= now;
};

const Property = mongoose.model('Property', propertySchema);

export default Property;
