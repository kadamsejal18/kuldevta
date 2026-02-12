import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    name: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'interested', 'not-interested', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['gallery', 'details', 'contact', 'whatsapp', 'call'],
      default: 'gallery',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
leadSchema.index({ property: 1, createdAt: -1 });
leadSchema.index({ status: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
