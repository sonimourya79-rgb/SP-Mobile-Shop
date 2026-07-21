const path = require('path');
const fs = require('fs');

function imageUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/${f.filename}`);
}

function deleteImageFiles(urls) {
  (urls || []).forEach((url) => {
    const filePath = path.join(__dirname, '..', url.replace(/^\/+/, ''));
    fs.unlink(filePath, () => {});
  });
}

/**
 * Builds standard list/getById/create/update/remove handlers for a catalog model
 * that has an `images` array field and simple exact-match filters + text search.
 */
function crudFactory(Model, { searchFields = [], filterFields = [], publicFilter = {} } = {}) {
  function buildQuery(req, includePublicFilter) {
    const query = includePublicFilter ? { ...publicFilter } : {};
    filterFields.forEach((field) => {
      if (req.query[field]) query[field] = req.query[field];
    });
    if (req.query.search && searchFields.length) {
      const regex = new RegExp(req.query.search.trim(), 'i');
      query.$or = searchFields.map((field) => ({ [field]: regex }));
    }
    return query;
  }

  async function list(req, res) {
    const items = await Model.find(buildQuery(req, true)).sort({ createdAt: -1 });
    res.json(items);
  }

  async function listAdmin(req, res) {
    const items = await Model.find(buildQuery(req, false)).sort({ createdAt: -1 });
    res.json(items);
  }

  async function getById(req, res) {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  }

  async function create(req, res) {
    const images = imageUrls(req.files);
    const item = await Model.create({ ...req.body, images });
    res.status(201).json(item);
  }

  async function update(req, res) {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    const newImages = imageUrls(req.files);
    Object.assign(item, req.body);
    if (newImages.length) item.images = [...item.images, ...newImages];
    if (req.body.removeImages) {
      const toRemove = Array.isArray(req.body.removeImages) ? req.body.removeImages : [req.body.removeImages];
      deleteImageFiles(toRemove);
      item.images = item.images.filter((img) => !toRemove.includes(img));
    }
    await item.save();
    res.json(item);
  }

  async function remove(req, res) {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    deleteImageFiles(item.images);
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  }

  return { list, listAdmin, getById, create, update, remove };
}

module.exports = crudFactory;
