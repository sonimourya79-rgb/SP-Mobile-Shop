const Product = require('../models/Product');
const SecondhandPhone = require('../models/SecondhandPhone');
const RepairRequest = require('../models/RepairRequest');
const SellRequest = require('../models/SellRequest');
const Order = require('../models/Order');

const LOW_STOCK_THRESHOLD = 5;

async function stats(req, res) {
  const [
    pendingRepairs,
    activeRepairs,
    pendingSellRequests,
    pendingOrders,
    lowStockProducts,
    totalProducts,
    availablePhones,
    totalOrders,
  ] = await Promise.all([
    RepairRequest.countDocuments({ status: 'received' }),
    RepairRequest.countDocuments({ status: { $in: ['diagnosing', 'in-progress'] } }),
    SellRequest.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ isActive: true, stock: { $lte: LOW_STOCK_THRESHOLD } }),
    Product.countDocuments({ isActive: true }),
    SecondhandPhone.countDocuments({ isActive: true, status: 'available' }),
    Order.countDocuments(),
  ]);

  res.json({
    pendingRepairs,
    activeRepairs,
    pendingSellRequests,
    pendingOrders,
    lowStockProducts,
    totalProducts,
    availablePhones,
    totalOrders,
  });
}

module.exports = { stats };
