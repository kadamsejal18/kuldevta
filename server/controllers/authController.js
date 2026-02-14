import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const validateSetupKey = (req, res) => {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  const providedSetupKey = req.headers['x-admin-setup-key'];

  if (process.env.NODE_ENV === 'production' && !setupKey) {
    res.status(403).json({
      success: false,
      message: 'Admin setup is disabled in production',
    });
    return false;
  }

  if (setupKey && providedSetupKey !== setupKey) {
    res.status(401).json({
      success: false,
      message: 'Invalid admin setup key',
    });
    return false;
  }

  return true;
};

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);

const migrateLegacyAdminRecord = async (legacyAdminDoc, normalizedEmail, enteredPassword) => {
  const legacyPassword =
    legacyAdminDoc.ADMIN_PASSWORD
    || legacyAdminDoc.admin_password
    || legacyAdminDoc.password;

  if (typeof legacyPassword !== 'string' || !legacyPassword) {
    return { matched: false, reason: 'Legacy admin password is missing' };
  }

  const matched = isBcryptHash(legacyPassword)
    ? await bcrypt.compare(enteredPassword, legacyPassword)
    : legacyPassword === enteredPassword;

  if (!matched) {
    return { matched: false };
  }

  const passwordHash = isBcryptHash(legacyPassword)
    ? legacyPassword
    : await bcrypt.hash(enteredPassword, 10);

  await Admin.collection.updateOne(
    { _id: legacyAdminDoc._id },
    {
      $set: {
        email: normalizedEmail,
        password: passwordHash,
        name: legacyAdminDoc.name || 'Admin',
        role: legacyAdminDoc.role || 'super-admin',
        active: legacyAdminDoc.active !== false,
        lastLogin: new Date(),
      },
      $unset: {
        ADMIN_EMAIL: '',
        ADMIN_PASSWORD: '',
        admin_email: '',
        admin_password: '',
      },
    }
  );

  return { matched: true, migrated: true, id: legacyAdminDoc._id };
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    if (!admin) {
      const legacyAdminDoc = await Admin.collection.findOne({
        $or: [
          { ADMIN_EMAIL: normalizedEmail },
          { admin_email: normalizedEmail },
        ],
      });

      if (legacyAdminDoc) {
        const migrationResult = await migrateLegacyAdminRecord(legacyAdminDoc, normalizedEmail, password);

        if (migrationResult.matched && migrationResult.id) {
          const migratedAdmin = await Admin.findById(migrationResult.id);
          const token = generateToken(migrationResult.id);

          return res.status(200).json({
            success: true,
            token,
            admin: {
              id: migratedAdmin._id,
              email: migratedAdmin.email,
              name: migratedAdmin.name,
              role: migratedAdmin.role,
            },
          });
        }

        return res.status(401).json({
          success: false,
          message: migrationResult.reason || 'Invalid credentials',
        });
      }

      const hasAnyAdmin = await Admin.exists({});
      return res.status(hasAnyAdmin ? 401 : 404).json({
        success: false,
        message: hasAnyAdmin
          ? 'Invalid credentials'
          : 'No admin account found. Create one using /api/auth/create-admin or reset via /api/auth/reset-password.',
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
    let isMatch = false;
    const looksHashed = isBcryptHash(admin.password);

    if (looksHashed) {
      isMatch = await admin.matchPassword(password);
    } else if (typeof admin.password === 'string') {
      isMatch = admin.password === password;
      if (isMatch) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login without re-saving password field
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

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

    const setupKey = process.env.ADMIN_SETUP_KEY;
    const providedSetupKey = req.headers['x-admin-setup-key'];
    const envEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || '';
    const reqEmail = (req.body?.email || '').trim().toLowerCase();
    const reqPassword = req.body?.password || '';

    const canBootstrapWithoutSetupKey =
      process.env.NODE_ENV === 'production'
      && !setupKey
      && envEmail
      && envPassword
      && reqEmail === envEmail
      && reqPassword === envPassword;

    if (!canBootstrapWithoutSetupKey && !validateSetupKey(req, res)) return;

    const { email, password, name } = req.body;
    const normalizedEmail = (email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (!normalizedEmail || !(password || process.env.ADMIN_PASSWORD)) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required',
      });
    }

    // Create admin
    const admin = await Admin.create({
      email: normalizedEmail,
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


// @desc    Reset admin password using setup key
// @route   POST /api/auth/reset-password
// @access  Protected by x-admin-setup-key
export const resetAdminPassword = async (req, res) => {
  try {
    if (!validateSetupKey(req, res)) return;

    const { email, password } = req.body;
    const normalizedEmail = (email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required',
      });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
    }

    admin.password = password;
    admin.active = true;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Admin password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
