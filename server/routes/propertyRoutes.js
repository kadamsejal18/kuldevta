import express from 'express';
import {
  getProperties,
  getProperty,
  incrementViews,
  getTrendingProperties,
  getFeaturedProperties,
  getAdvertisements,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  toggleFeatured,
  toggleActive,
  getAdminProperties,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/trending', getTrendingProperties);
router.get('/featured', getFeaturedProperties);
router.get('/advertisements', getAdvertisements);
router.get('/:id', getProperty);
router.put('/:id/view', incrementViews);

// Admin routes
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'videos', maxCount: 5 },
  ]),
  createProperty
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'videos', maxCount: 5 },
  ]),
  updateProperty
);

router.delete('/:id', protect, deleteProperty);
router.delete('/:id/images/:publicId', protect, deletePropertyImage);
router.put('/:id/featured', protect, toggleFeatured);
router.put('/:id/active', protect, toggleActive);

// Admin property list
router.get('/admin/all', protect, getAdminProperties);

export default router;
