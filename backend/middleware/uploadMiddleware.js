// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Use memory storage (files stored as buffer in memory, then uploaded to Cloudinary)
const storage = multer.memoryStorage();

// File filter - only allow PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/tiff',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, JPEG, PNG, WebP, and TIFF files are allowed.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

module.exports = upload;
