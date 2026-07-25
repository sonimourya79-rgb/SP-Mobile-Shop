const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { listMine, markRead, markAllRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/mine', protect, asyncHandler(listMine));
router.put('/read-all', protect, asyncHandler(markAllRead));
router.put('/:id/read', protect, asyncHandler(markRead));

module.exports = router;
