const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { stats } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', protect, adminOnly, asyncHandler(stats));

module.exports = router;
