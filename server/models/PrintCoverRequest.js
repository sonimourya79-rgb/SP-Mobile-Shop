const mongoose = require('mongoose');

const printCoverRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    deviceBrand: { type: String, required: true, trim: true },
    deviceModel: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['received', 'printing', 'ready', 'delivered', 'cancelled'],
      default: 'received',
    },
    price: { type: Number, default: 0 },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrintCoverRequest', printCoverRequestSchema);
