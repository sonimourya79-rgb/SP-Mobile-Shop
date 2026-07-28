const fs = require('fs');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

function writeBufferToDisk(buffer, originalname) {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${unique}${path.extname(originalname || '') || '.jpg'}`;
  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

let warnedNoCloudinary = false;

// Uploads a single multer memory-storage file (file.buffer) and returns the
// resulting URL. Uses Cloudinary when configured (persists across restarts/
// redeploys, needed on hosts with an ephemeral filesystem like Render's free
// tier); otherwise falls back to local disk for local development.
async function storeImage(file, folder = 'sp-mobile') {
  if (isCloudinaryConfigured()) {
    const result = await uploadBufferToCloudinary(file.buffer, folder);
    return result.secure_url;
  }
  if (!warnedNoCloudinary) {
    warnedNoCloudinary = true;
    console.warn(
      'CLOUDINARY_* env vars not set — saving uploads to local disk. This is fine for local ' +
        'development but will NOT persist on hosts with an ephemeral filesystem (e.g. Render free tier).'
    );
  }
  return writeBufferToDisk(file.buffer, file.originalname);
}

async function storeImages(files, folder = 'sp-mobile') {
  return Promise.all((files || []).map((f) => storeImage(f, folder)));
}

function extractCloudinaryPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function deleteImage(url) {
  if (!url) return;
  if (url.includes('res.cloudinary.com')) {
    const publicId = extractCloudinaryPublicId(url);
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Failed to delete Cloudinary asset:', publicId, err.message);
    }
    return;
  }
  const filePath = path.join(__dirname, '..', url.replace(/^\/+/, ''));
  fs.unlink(filePath, () => {});
}

async function deleteImages(urls) {
  await Promise.all((urls || []).map((u) => deleteImage(u)));
}

module.exports = { storeImage, storeImages, deleteImage, deleteImages };
