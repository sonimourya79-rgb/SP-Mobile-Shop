const User = require('../models/User');

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function list(req, res) {
  const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
  res.json(customers.map(toPublicUser));
}

async function create(req, res) {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: 'An account with this email already exists' });

  const user = await User.create({ name, email, password, phone, role: 'customer' });
  res.status(201).json(toPublicUser(user));
}

async function update(req, res) {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'customer') return res.status(404).json({ message: 'Customer not found' });

  const { name, email, phone, password } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (password) user.password = password;

  await user.save();
  res.json(toPublicUser(user));
}

async function remove(req, res) {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'customer') return res.status(404).json({ message: 'Customer not found' });
  await user.deleteOne();
  res.json({ message: 'Deleted' });
}

module.exports = { list, create, update, remove };
