const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const asyncHandler = require('../middleware/asyncHandler');

/** Wires the shared create/listMine/listAdmin/updateStatus handlers from requestFactory onto a router. */
function buildRequestRouter(controller) {
  const router = express.Router();

  router.post('/', optionalAuth, asyncHandler(controller.create));
  router.get('/mine', protect, asyncHandler(controller.listMine));
  router.get('/', protect, adminOnly, asyncHandler(controller.listAdmin));
  router.put('/:id/status', protect, adminOnly, asyncHandler(controller.updateStatus));

  return router;
}

module.exports = buildRequestRouter;
