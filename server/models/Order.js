const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ['Product', 'SecondhandPhone'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
