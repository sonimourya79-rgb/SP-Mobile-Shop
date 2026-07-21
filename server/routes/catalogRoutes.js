const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const upload = require('../middleware/upload');

/** Wires the shared list/getById/create/update/remove handlers from crudFactory onto a router. */
function buildCatalogRouter(controller) {
  const router = express.Router();

  router.get('/', asyncHandler(controller.list));
  router.get('/admin', protect, adminOnly, asyncHandler(controller.listAdmin));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/', protect, adminOnly, upload.array('images', 6), asyncHandler(controller.create));
  router.put('/:id', protect, adminOnly, upload.array('images', 6), asyncHandler(controller.update));
  router.delete('/:id', protect, adminOnly, asyncHandler(controller.remove));

  return router;
}

module.exports = buildCatalogRouter;
