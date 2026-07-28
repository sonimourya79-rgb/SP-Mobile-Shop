const PrintCoverRequest = require('../models/PrintCoverRequest');
const { notifyAdmins, notifyUser } = require('../utils/notify');
const { storeImage } = require('../utils/imageStore');

async function create(req, res) {
  const { name, phone, email, deviceBrand, deviceModel, notes } = req.body;
  if (!name || !phone || !deviceBrand || !deviceModel) {
    return res.status(400).json({ message: 'Name, phone, device brand and model are required' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload the photo you want printed' });
  }

  const photo = await storeImage(req.file, 'sp-mobile/print-covers');

  const request = await PrintCoverRequest.create({
    user: req.user ? req.user._id : undefined,
    name,
    phone,
    email,
    deviceBrand,
    deviceModel,
    notes,
    photo,
  });

  await notifyAdmins(
    `New photo print cover request from ${name} — ${deviceBrand} ${deviceModel}`,
    '/admin/print-covers'
  );

  res.status(201).json(request);
}

async function listMine(req, res) {
  const requests = await PrintCoverRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
}

async function listAdmin(req, res) {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const requests = await PrintCoverRequest.find(query).sort({ createdAt: -1 });
  res.json(requests);
}

async function updateStatus(req, res) {
  const request = await PrintCoverRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Not found' });

  const { status, price, adminNotes } = req.body;
  const statusChanged = status !== undefined && status !== request.status;
  const notesChanged = adminNotes !== undefined && adminNotes !== request.adminNotes;

  if (status !== undefined) request.status = status;
  if (price !== undefined) request.price = price;
  if (adminNotes !== undefined) request.adminNotes = adminNotes;
  await request.save();

  if (request.user && (statusChanged || notesChanged)) {
    const detail = statusChanged ? `status is now "${request.status}"` : 'has a new note from the shop';
    await notifyUser(
      request.user,
      `Your photo print cover request (${request.deviceBrand} ${request.deviceModel}) ${detail}`,
      '/account/print-covers'
    );
  }

  res.json(request);
}

module.exports = { create, listMine, listAdmin, updateStatus };
