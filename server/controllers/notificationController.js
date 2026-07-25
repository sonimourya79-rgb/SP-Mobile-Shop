const Notification = require('../models/Notification');

async function listMine(req, res) {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);
  res.json(notifications);
}

async function markRead(req, res) {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) return res.status(404).json({ message: 'Not found' });
  notification.read = true;
  await notification.save();
  res.json(notification);
}

async function markAllRead(req, res) {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All marked as read' });
}

module.exports = { listMine, markRead, markAllRead };
