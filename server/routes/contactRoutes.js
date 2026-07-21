const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { create, listAdmin, updateStatus } = require('../controllers/contactController');

const router = express.Router();

router.post('/', asyncHandler(create));
router.get('/', protect, adminOnly, asyncHandler(listAdmin));
router.put('/:id/status', protect, adminOnly, asyncHandler(updateStatus));

module.exports = router;
