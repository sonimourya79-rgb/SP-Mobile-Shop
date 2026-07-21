const StockPurchase = require('../models/StockPurchase');
const Product = require('../models/Product');

async function create(req, res) {
  const { product, quantity, costPrice, supplier, notes } = req.body;
  const qty = Number(quantity);
  if (!product || !qty || qty <= 0) {
    return res.status(400).json({ message: 'Product and a positive quantity are required' });
  }

  const prod = await Product.findById(product);
  if (!prod) return res.status(404).json({ message: 'Product not found' });

  const purchase = await StockPurchase.create({
    product,
    quantity: qty,
    costPrice: Number(costPrice) || 0,
    supplier,
    notes,
  });

  prod.stock += qty;
  await prod.save();

  res.status(201).json(await purchase.populate('product', 'name category stock'));
}

async function list(req, res) {
  const query = {};
  if (req.query.product) query.product = req.query.product;
  const purchases = await StockPurchase.find(query).populate('product', 'name category').sort({ createdAt: -1 });
  res.json(purchases);
}

module.exports = { create, list };
