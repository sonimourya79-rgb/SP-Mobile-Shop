const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { create, list } = require('../controllers/purchaseController');

const router = express.Router();

router.post('/', protect, adminOnly, asyncHandler(create));
router.get('/', protect, adminOnly, asyncHandler(list));

module.exports = router;
