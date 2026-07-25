const User = require('../models/User');
const Notification = require('../models/Notification');

async function notifyAdmins(message, link = '') {
  const admins = await User.find({ role: 'admin' }).select('_id');
  if (!admins.length) return;
  await Notification.insertMany(admins.map((admin) => ({ user: admin._id, message, link })));
}

async function notifyUser(userId, message, link = '') {
  if (!userId) return;
  await Notification.create({ user: userId, message, link });
}

module.exports = { notifyAdmins, notifyUser };
