const mongoose = require('mongoose');

const secondhandPhoneSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    condition: { type: String, enum: ['Excellent', 'Good', 'Fair'], default: 'Good' },
    storage: { type: String, default: '' },
    color: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    images: [{ type: String }],
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SecondhandPhone', secondhandPhoneSchema);
