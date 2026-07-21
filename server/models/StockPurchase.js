const mongoose = require('mongoose');

const stockPurchaseSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    costPrice: { type: Number, default: 0, min: 0 },
    supplier: { type: String, default: '', trim: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockPurchase', stockPurchaseSchema);
