import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB, { isDbConnected } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { login } from './controllers/authController.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Render/Vercel sit behind a reverse proxy; trust first proxy hop for correct client IP.
app.enable('trust proxy');
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

const LEGACY_PREFIXES = ['/auth', '/properties', '/leads'];

// Backward compatibility for clients that call routes without the `/api` prefix.
app.use((req, res, next) => {
  const shouldRewrite = LEGACY_PREFIXES.some(
    (prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`)
  );

  if (shouldRewrite) {
    req.url = `/api${req.url}`;
  }

  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Health check route
app.get('/health', (req, res) => {
  res.status(isDbConnected() ? 200 : 503).json({
    success: isDbConnected(),
    message: isDbConnected() ? 'Server is running' : 'Server running but database unavailable',
    dbConnected: isDbConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Explicit login handlers kept at app-level as a compatibility fallback for deployments/proxies.
app.route('/api/auth/login')
  .post(login)
  .get((req, res) => {
    res.status(405).json({
      success: false,
      message: 'Use POST /api/auth/login for admin authentication',
    });
  });

app.route('/auth/login')
  .post(login)
  .get((req, res) => {
    res.status(405).json({
      success: false,
      message: 'Use POST /auth/login for admin authentication',
    });
  });

app.get('/login', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Use POST /api/auth/login for admin authentication',
  });
});

// API availability guard
const dbGuard = (req, res, next) => {
  if (isDbConnected()) return next();

  return res.status(503).json({
    success: false,
    message: 'Database unavailable. Check MongoDB Atlas network access/whitelist and server configuration.',
  });
};

app.use('/api', dbGuard);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kuldevta Estate Agency API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      leads: '/api/leads',
      health: '/health',
    },
    compatibility: 'Calls to /auth, /properties, and /leads are automatically rewritten to /api/*',
  });
});


// Prevent noisy 404/500 logs from browser favicon auto-requests.
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
