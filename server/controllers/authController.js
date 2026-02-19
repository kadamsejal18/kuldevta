import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for admin
    let admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    // Auto-bootstrap admin from env on first login attempt
    if (!admin) {
      const envEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      const envPassword = String(process.env.ADMIN_PASSWORD || '');

      if (normalizedEmail === envEmail && password === envPassword) {
        admin = await Admin.create({
          email: envEmail,
          password: envPassword,
          name: 'Admin',
          role: 'super-admin',
        });
        admin = await Admin.findOne({ email: envEmail }).select('+password');
      }
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if admin is active
    if (!admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Check password
    let isMatch = await admin.matchPassword(password);

    // Keep DB admin password synced with env admin password for configured admin account
    if (!isMatch) {
      const envEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      const envPassword = String(process.env.ADMIN_PASSWORD || '');

      if (normalizedEmail === envEmail && password === envPassword) {
        admin.password = envPassword;
        await admin.save();
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create initial admin (should be run once and then disabled)
// @route   POST /api/auth/create-admin
// @access  Public (DISABLE IN PRODUCTION AFTER FIRST RUN)
export const createAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({});

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. This endpoint is disabled.',
      });
    }

    const { email, password, name } = req.body;
    const adminEmail = String(email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    // Create admin
    const admin = await Admin.create({
      email: adminEmail,
      password: password || process.env.ADMIN_PASSWORD,
      name: name || 'Admin',
      role: 'super-admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
