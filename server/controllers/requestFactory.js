/**
 * Builds create/listMine/listAdmin/updateStatus handlers for the two "customer submits
 * a request, admin tracks it through a status workflow" models: RepairRequest, SellRequest.
 */
function requestFactory(Model) {
  async function create(req, res) {
    const payload = { ...req.body };
    if (req.user) payload.user = req.user._id;
    const item = await Model.create(payload);
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
    if (status !== undefined) item.status = status;
    if (adminNotes !== undefined) item.adminNotes = adminNotes;
    if (estimatedCost !== undefined) item.estimatedCost = estimatedCost;
    if (offeredPrice !== undefined) item.offeredPrice = offeredPrice;
    await item.save();
    res.json(item);
  }

  return { create, listMine, listAdmin, updateStatus };
}

module.exports = requestFactory;
