const Order = require('../models/Order');
const Product = require('../models/Product');
const SecondhandPhone = require('../models/SecondhandPhone');
const { notifyAdmins, notifyUser } = require('../utils/notify');

async function create(req, res) {
  const { items, customerName, phone, address, notes } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.price * item.qty;
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    customerName,
    phone,
    address,
    notes,
    totalAmount,
  });

  await notifyAdmins(`New order from ${customerName} — ₹${totalAmount}`, '/admin/orders');

  res.status(201).json(order);
}

async function listMine(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}

async function listAdmin(req, res) {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const orders = await Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json(orders);
}

async function updateStatus(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });

  const wasConfirmed = order.status === 'confirmed' || order.status === 'ready' || order.status === 'completed';
  const { status, notes } = req.body;
  const statusChanged = status !== undefined && status !== order.status;
  const notesChanged = notes !== undefined && notes !== order.notes;

  if (status === 'confirmed' && !wasConfirmed) {
    for (const item of order.items) {
      if (item.itemType === 'Product') {
        await Product.findByIdAndUpdate(item.itemId, { $inc: { stock: -item.qty } });
      } else if (item.itemType === 'SecondhandPhone') {
        await SecondhandPhone.findByIdAndUpdate(item.itemId, { status: 'sold' });
      }
    }
  }

  if (status !== undefined) order.status = status;
  if (notes !== undefined) order.notes = notes;
  await order.save();

  if (statusChanged || notesChanged) {
    const detail = statusChanged ? `status is now "${order.status}"` : 'has a new note from the shop';
    await notifyUser(order.user, `Your order (₹${order.totalAmount}) ${detail}`, '/account/orders');
  }

  res.json(order);
}

module.exports = { create, listMine, listAdmin, updateStatus };
