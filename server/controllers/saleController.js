const StockSale = require('../models/StockSale');
const Product = require('../models/Product');

async function create(req, res) {
  const { product, quantity, sellingPrice, customerName, notes } = req.body;
  const qty = Number(quantity);
  if (!product || !qty || qty <= 0) {
    return res.status(400).json({ message: 'Product and a positive quantity are required' });
  }

  const prod = await Product.findById(product);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  if (prod.stock < qty) {
    return res.status(400).json({ message: `Only ${prod.stock} unit(s) in stock` });
  }

  const sale = await StockSale.create({
    product,
    quantity: qty,
    sellingPrice: sellingPrice !== undefined && sellingPrice !== '' ? Number(sellingPrice) : prod.price,
    customerName,
    notes,
  });

  prod.stock -= qty;
  await prod.save();

  res.status(201).json(await sale.populate('product', 'name category stock'));
}

async function list(req, res) {
  const query = {};
  if (req.query.product) query.product = req.query.product;
  const sales = await StockSale.find(query).populate('product', 'name category').sort({ createdAt: -1 });
  res.json(sales);
}

module.exports = { create, list };
