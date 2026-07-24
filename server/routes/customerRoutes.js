const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { list, create, update, remove } = require('../controllers/customerController');

const router = express.Router();

router.get('/', protect, adminOnly, asyncHandler(list));
router.post('/', protect, adminOnly, asyncHandler(create));
router.put('/:id', protect, adminOnly, asyncHandler(update));
router.delete('/:id', protect, adminOnly, asyncHandler(remove));

module.exports = router;
