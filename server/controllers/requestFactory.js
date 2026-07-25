const { notifyAdmins, notifyUser } = require('../utils/notify');

/**
 * Builds create/listMine/listAdmin/updateStatus handlers for the two "customer submits
 * a request, admin tracks it through a status workflow" models: RepairRequest, SellRequest.
 *
 * notifyConfig: { kind: 'repair'|'sell', adminLink, customerLink } drives the notifications
 * sent to admins on a new submission and back to the customer when admin updates it.
 */
function requestFactory(Model, notifyConfig) {
  const { kind, adminLink, customerLink } = notifyConfig;

  async function create(req, res) {
    const payload = { ...req.body };
    if (req.user) payload.user = req.user._id;
    const item = await Model.create(payload);
    await notifyAdmins(
      `New ${kind} request from ${item.name} — ${item.deviceBrand} ${item.deviceModel}`,
      adminLink
    );
    res.status(201).json(item);
  }

  async function listMine(req, res) {
    const items = await Model.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  }

  async function listAdmin(req, res) {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    const items = await Model.find(query).sort({ createdAt: -1 });
    res.json(items);
  }

  async function updateStatus(req, res) {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { status, adminNotes, estimatedCost, offeredPrice } = req.body;
    const statusChanged = status !== undefined && status !== item.status;
    const notesChanged = adminNotes !== undefined && adminNotes !== item.adminNotes;

    if (status !== undefined) item.status = status;
    if (adminNotes !== undefined) item.adminNotes = adminNotes;
    if (estimatedCost !== undefined) item.estimatedCost = estimatedCost;
    if (offeredPrice !== undefined) item.offeredPrice = offeredPrice;
    await item.save();

    if (item.user && (statusChanged || notesChanged)) {
      const detail = statusChanged ? `status is now "${item.status}"` : 'has a new note from the shop';
      await notifyUser(
        item.user,
        `Your ${kind} request (${item.deviceBrand} ${item.deviceModel}) ${detail}`,
        customerLink
      );
    }

    res.json(item);
  }

  return { create, listMine, listAdmin, updateStatus };
}

module.exports = requestFactory;
