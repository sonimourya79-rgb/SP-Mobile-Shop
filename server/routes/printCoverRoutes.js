const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const asyncHandler = require('../middleware/asyncHandler');
const upload = require('../middleware/upload');
const { create, listMine, listAdmin, updateStatus } = require('../controllers/printCoverController');

const router = express.Router();

router.post('/', optionalAuth, upload.single('photo'), asyncHandler(create));
router.get('/mine', protect, asyncHandler(listMine));
router.get('/', protect, adminOnly, asyncHandler(listAdmin));
router.put('/:id/status', protect, adminOnly, asyncHandler(updateStatus));

module.exports = router;
