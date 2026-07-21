const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    deviceBrand: { type: String, required: true, trim: true },
    deviceModel: { type: String, required: true, trim: true },
    issueType: {
      type: String,
      enum: ['Display', 'Battery', 'Charging Pin', 'Speaker/Mic', 'Other'],
      default: 'Other',
    },
    issueDescription: { type: String, default: '' },
    status: {
      type: String,
      enum: ['received', 'diagnosing', 'in-progress', 'completed', 'delivered', 'cancelled'],
      default: 'received',
    },
    estimatedCost: { type: Number, default: 0 },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RepairRequest', repairRequestSchema);
