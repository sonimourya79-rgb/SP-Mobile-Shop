const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { runSeed } = require('../seed/seedAdmin');

const router = express.Router();

// One-off seeding endpoint for hosts without shell access (e.g. Render's free
// tier). Protected by a shared secret (not the admin account, which may not
// exist yet on a fresh database) rather than JWT auth.
router.post(
  '/seed',
  asyncHandler(async (req, res) => {
    const provided = req.headers['x-seed-secret'] || req.query.secret;
    if (!process.env.SEED_SECRET || provided !== process.env.SEED_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await runSeed();
    res.json({ message: 'Seed complete' });
  })
);

module.exports = router;
