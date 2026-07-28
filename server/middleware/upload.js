const multer = require('multer');

// Always buffer in memory — server/utils/imageStore.js then either uploads
// the buffer to Cloudinary (when configured) or writes it to local disk
// (dev fallback). Using memory storage keeps a single code path regardless
// of which destination is used.
function fileFilter(req, file, cb) {
  if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only image files are allowed'));
}

const upload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
