const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    deviceBrand: { type: String, required: true, trim: true },
    deviceModel: { type: String, required: true, trim: true },
    condition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'], default: 'Good' },
    expectedPrice: { type: Number, default: 0 },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'offer-made', 'purchased', 'rejected'],
      default: 'pending',
    },
    offeredPrice: { type: Number, default: 0 },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellRequest', sellRequestSchema);
