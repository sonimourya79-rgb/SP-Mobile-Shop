const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'Tempered Glass',
        'Back Cover',
        'Charger',
        'Charging Cable',
        'Power Bank',
        'Battery',
        'Wired Earphones',
        'Neckband Bluetooth',
        'Bluetooth Earbuds',
        'Bluetooth Speaker',
        'Mobile Holder',
        'OTG & Adapters',
        'Other',
      ],
      default: 'Other',
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
