# Kuldevta Estate Agency - Full Stack Real Estate SaaS

A complete real estate SaaS platform with advanced property management, lead tracking, and advertisement management.

## 🚀 Features

### Public Features
- 🏠 Browse properties (Buy/Rent)
- 🔍 Advanced search and filters
- ⭐ Featured properties
- 📊 Trending properties (based on views)
- 📢 Advertisement section
- 📱 WhatsApp integration (9930388219)
- ☎️ Click-to-call (9930388219)
- 👁️ View tracking
- 📧 Lead capture system

### Admin Features
- 🔐 Secure admin login (/admin route)
- ➕ Add/Edit/Delete properties
- 🖼️ Multiple image upload (Cloudinary)
- 🎥 Multiple video upload (Cloudinary)
- ⭐ Mark properties as Featured
- 📢 Advertisement management with date range
- 👁️ Hide/Show properties
- 📊 View counts
- 📋 Lead management per property
- 📈 Lead statistics

## 📁 Project Structure

```
kuldevta-estate-agency/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Database & Cloudinary config
│   ├── models/            # Mongoose models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, upload, error handling
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env.example       # Environment variables template
│
├── src/                   # Frontend (React + Vite)
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── App.jsx
│   └── main.jsx
│
├── package.json           # Frontend dependencies
└── README.md
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image/Video storage)
- Multer (File upload)
- Helmet (Security)
- Express Rate Limit

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Lucide React (Icons)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB account
- Cloudinary account
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kuldevta-estate-agency
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Configuration
ADMIN_EMAIL=admin@kuldevta.com
ADMIN_PASSWORD=your_secure_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Create Admin Account
```bash
# Start the server
npm start

# Make a POST request to create admin (one-time only)
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kuldevta.com",
    "password": "your_secure_password",
    "name": "Admin"
  }'
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ..  # Back to root directory
npm install
```

#### Configure Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Backend will run on http://localhost:5000

#### Terminal 2 - Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
npm run build
npm run preview
```

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up or login

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: kuldevta-backend
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

4. **Add Environment Variables**
   - Add all variables from `.env` file
   - Update `FRONTEND_URL` to your Vercel URL

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Frontend Deployment (Vercel)

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## 📱 Admin Access

- URL: `https://your-domain.com/admin`
- Email: Your configured admin email
- Password: Your configured admin password

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/create-admin` - Create admin (one-time)

### Properties (Public)
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `GET /api/properties/trending` - Get trending properties
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/advertisements` - Get active advertisements
- `PUT /api/properties/:id/view` - Increment view count

### Properties (Admin)
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `PUT /api/properties/:id/featured` - Toggle featured
- `PUT /api/properties/:id/active` - Toggle active/hidden
- `DELETE /api/properties/:id/images/:publicId` - Delete image
- `GET /api/properties/admin/all` - Get all properties (admin)

### Leads
- `POST /api/leads` - Create lead (public)
- `GET /api/leads` - Get all leads (admin)
- `GET /api/leads/property/:propertyId` - Get leads by property (admin)
- `PUT /api/leads/:id` - Update lead status (admin)
- `DELETE /api/leads/:id` - Delete lead (admin)
- `GET /api/leads/stats` - Get lead statistics (admin)

## 🔒 Security Features

- JWT Authentication
- Password hashing (bcrypt)
- Helmet.js security headers
- Rate limiting
- CORS configuration
- Input validation
- XSS protection

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Support

For support, email: admin@kuldevta.com
WhatsApp: +91 9930388219

## 🙏 Credits

Built with ❤️ for Kuldevta Estate Agency
