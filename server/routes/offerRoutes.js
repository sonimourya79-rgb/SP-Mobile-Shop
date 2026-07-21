const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { audience, send } = require('../controllers/offerController');

const router = express.Router();

router.get('/audience', protect, adminOnly, asyncHandler(audience));
router.post('/send', protect, adminOnly, asyncHandler(send));

module.exports = router;
