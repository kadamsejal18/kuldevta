import Property from '../models/Property.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Helper function to upload to Cloudinary

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return undefined;
};

const normalizePropertyPayload = (payload) => {
  const normalized = { ...payload };
  const numberFields = ['price', 'area', 'bedrooms', 'bathrooms', 'views'];

  numberFields.forEach((field) => {
    if (normalized[field] !== undefined && normalized[field] !== '') {
      normalized[field] = Number(normalized[field]);
    }
  });

  ['featured', 'advertised', 'active'].forEach((field) => {
    if (normalized[field] !== undefined) {
      const parsed = parseBoolean(normalized[field]);
      if (parsed !== undefined) normalized[field] = parsed;
    }
  });

  return normalized;
};

const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// @desc    Get all properties (public)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const {
      city,
      type,
      category,
      minPrice,
      maxPrice,
      featured,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = { active: true };

    if (city) query.city = new RegExp(city, 'i');
    if (type) query.type = type;
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties,
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Increment property views
// @route   PUT /api/properties/:id/view
// @access  Public
export const incrementViews = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.status(200).json({
      success: true,
      views: property.views,
    });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get trending properties (most viewed)
// @route   GET /api/properties/trending
// @access  Public
export const getTrendingProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.find({ active: true })
      .sort('-views')
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Get trending properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.find({ 
      active: true, 
      featured: true 
    })
      .sort('-createdAt')
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get active advertisements
// @route   GET /api/properties/advertisements
// @access  Public
export const getAdvertisements = async (req, res) => {
  try {
    const now = new Date();

    const properties = await Property.find({
      active: true,
      advertised: true,
      adStartDate: { $lte: now },
      adEndDate: { $gte: now },
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create property (Admin)
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = async (req, res) => {
  try {
    const propertyData = normalizePropertyPayload(req.body);

    // Handle image uploads
    if (req.files && req.files.images) {
      const imagePromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, 'kuldevta/properties', 'image')
      );
      const imageResults = await Promise.all(imagePromises);
      propertyData.images = imageResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    // Handle video uploads
    if (req.files && req.files.videos) {
      const videoPromises = req.files.videos.map((file) =>
        uploadToCloudinary(file.buffer, 'kuldevta/videos', 'video')
      );
      const videoResults = await Promise.all(videoPromises);
      propertyData.videos = videoResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update property (Admin)
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const propertyData = normalizePropertyPayload(req.body);

    // Handle new image uploads
    if (req.files && req.files.images) {
      const imagePromises = req.files.images.map((file) =>
        uploadToCloudinary(file.buffer, 'kuldevta/properties', 'image')
      );
      const imageResults = await Promise.all(imagePromises);
      const newImages = imageResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
      
      propertyData.images = [...(property.images || []), ...newImages];
    }

    // Handle new video uploads
    if (req.files && req.files.videos) {
      const videoPromises = req.files.videos.map((file) =>
        uploadToCloudinary(file.buffer, 'kuldevta/videos', 'video')
      );
      const videoResults = await Promise.all(videoPromises);
      const newVideos = videoResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
      
      propertyData.videos = [...(property.videos || []), ...newVideos];
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      propertyData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete property (Admin)
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Delete images from Cloudinary
    if (property.images && property.images.length > 0) {
      const deleteImagePromises = property.images.map((img) =>
        cloudinary.uploader.destroy(img.publicId)
      );
      await Promise.all(deleteImagePromises);
    }

    // Delete videos from Cloudinary
    if (property.videos && property.videos.length > 0) {
      const deleteVideoPromises = property.videos.map((video) =>
        cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' })
      );
      await Promise.all(deleteVideoPromises);
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete property image (Admin)
// @route   DELETE /api/properties/:id/images/:publicId
// @access  Private/Admin
export const deletePropertyImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const { publicId } = req.params;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from property
    property.images = property.images.filter(
      (img) => img.publicId !== publicId
    );
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      property,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle property featured status (Admin)
// @route   PUT /api/properties/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.featured = !property.featured;
    await property.save();

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle property active status (Admin)
// @route   PUT /api/properties/:id/active
// @access  Private/Admin
export const toggleActive = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.active = !property.active;
    await property.save();

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error('Toggle active error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all properties for admin
// @route   GET /api/admin/properties
// @access  Private/Admin
export const getAdminProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      active,
      featured,
      advertised,
    } = req.query;

    const query = {};
    if (active !== undefined) query.active = active === 'true';
    if (featured !== undefined) query.featured = featured === 'true';
    if (advertised !== undefined) query.advertised = advertised === 'true';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const properties = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties,
    });
  } catch (error) {
    console.error('Get admin properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
