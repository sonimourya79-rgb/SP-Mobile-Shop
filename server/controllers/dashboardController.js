const Product = require('../models/Product');
const SecondhandPhone = require('../models/SecondhandPhone');
const RepairRequest = require('../models/RepairRequest');
const SellRequest = require('../models/SellRequest');
const Order = require('../models/Order');
const StockSale = require('../models/StockSale');
const StockPurchase = require('../models/StockPurchase');
const PrintCoverRequest = require('../models/PrintCoverRequest');

const LOW_STOCK_THRESHOLD = 5;
const FULFILLED_ORDER_STATUSES = ['confirmed', 'ready', 'completed'];
const GRANULARITIES = ['day', 'week', 'month', 'year'];
const SHOP_TIMEZONE = 'Asia/Kolkata';

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
    pendingPrintCovers,
  ] = await Promise.all([
    RepairRequest.countDocuments({ status: 'received' }),
    RepairRequest.countDocuments({ status: { $in: ['diagnosing', 'in-progress'] } }),
    SellRequest.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ isActive: true, stock: { $lte: LOW_STOCK_THRESHOLD } }),
    Product.countDocuments({ isActive: true }),
    SecondhandPhone.countDocuments({ isActive: true, status: 'available' }),
    Order.countDocuments(),
    PrintCoverRequest.countDocuments({ status: { $in: ['received', 'printing'] } }),
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
    pendingPrintCovers,
  });
}

function defaultFrom(granularity, now) {
  const d = new Date(now);
  switch (granularity) {
    case 'day':
      d.setDate(d.getDate() - 29);
      break;
    case 'week':
      d.setDate(d.getDate() - 7 * 11);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() - 4);
      break;
    case 'month':
    default:
      d.setMonth(d.getMonth() - 11);
      break;
  }
  return d;
}

async function profit(req, res) {
  const granularity = GRANULARITIES.includes(req.query.granularity) ? req.query.granularity : 'month';
  const now = new Date();
  const from = req.query.from ? new Date(req.query.from) : defaultFrom(granularity, now);
  const to = req.query.to ? new Date(req.query.to) : now;

  const truncDate = (field) => ({ $dateTrunc: { date: field, unit: granularity, timezone: SHOP_TIMEZONE } });

  const [salesAgg, purchaseAgg, orderAgg] = await Promise.all([
    StockSale.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: truncDate('$createdAt'), revenue: { $sum: { $multiply: ['$sellingPrice', '$quantity'] } } } },
    ]),
    StockPurchase.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: truncDate('$createdAt'), cost: { $sum: { $multiply: ['$costPrice', '$quantity'] } } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, status: { $in: FULFILLED_ORDER_STATUSES } } },
      { $unwind: '$items' },
      { $match: { 'items.itemType': 'Product' } },
      { $group: { _id: truncDate('$createdAt'), revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
    ]),
  ]);

  const buckets = new Map();
  function ensure(date) {
    const key = date.toISOString();
    if (!buckets.has(key)) buckets.set(key, { period: date, revenue: 0, cost: 0 });
    return buckets.get(key);
  }
  salesAgg.forEach((r) => { ensure(r._id).revenue += r.revenue; });
  orderAgg.forEach((r) => { ensure(r._id).revenue += r.revenue; });
  purchaseAgg.forEach((r) => { ensure(r._id).cost += r.cost; });

  const series = [...buckets.values()]
    .map((b) => ({ period: b.period, revenue: b.revenue, cost: b.cost, profit: b.revenue - b.cost }))
    .sort((a, b) => a.period - b.period);

  const totals = series.reduce(
    (acc, s) => ({
      revenue: acc.revenue + s.revenue,
      cost: acc.cost + s.cost,
      profit: acc.profit + s.profit,
    }),
    { revenue: 0, cost: 0, profit: 0 }
  );

  res.json({ granularity, from, to, series, totals });
}

module.exports = { stats, profit };
