import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|mkv/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'images') {
    const isValid = allowedImageTypes.test(extname.slice(1)) && 
                    mimetype.startsWith('image/');
    if (isValid) {
      return cb(null, true);
    }
  } else if (file.fieldname === 'videos') {
    const isValid = allowedVideoTypes.test(extname.slice(1)) && 
                    mimetype.startsWith('video/');
    if (isValid) {
      return cb(null, true);
    }
  }

  cb(new Error('Invalid file type. Only images and videos are allowed!'));
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: fileFilter,
});

export default upload;
