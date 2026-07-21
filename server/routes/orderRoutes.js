const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { create, listMine, listAdmin, updateStatus } = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, asyncHandler(create));
router.get('/mine', protect, asyncHandler(listMine));
router.get('/', protect, adminOnly, asyncHandler(listAdmin));
router.put('/:id/status', protect, adminOnly, asyncHandler(updateStatus));

module.exports = router;
