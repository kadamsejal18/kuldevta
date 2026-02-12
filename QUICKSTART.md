# 🚀 Quick Start Guide

Get Kuldevta Estate Agency running locally in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- MongoDB account (or local MongoDB)
- Cloudinary account

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd kuldevta-estate-agency

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 2: Configure Backend

1. **Create MongoDB Database**
   - Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string

2. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com)
   - Get credentials from dashboard

3. **Setup Environment Variables**

```bash
# Copy example env file
cd server
cp .env.example .env

# Edit .env with your details
nano .env  # or use any text editor
```

Update these in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@kuldevta.com
ADMIN_PASSWORD=your_secure_password
ADMIN_SETUP_KEY=set_a_random_setup_key
```

## Step 3: Configure Frontend

```bash
# Go back to root
cd ..

# Copy example env file
cp .env.example .env

# Content should be:
# VITE_API_URL=http://localhost:5000/api
```

## Step 4: Start Backend

```bash
cd server
npm start

# You should see:
# MongoDB Connected: cluster0.xxxxx.mongodb.net
# Server running in production mode on port 5000
```

## Step 5: Create Admin Account

Open a new terminal and run:

```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -H "x-admin-setup-key: <your_admin_setup_key>" \
  -d '{
    "email": "admin@kuldevta.com",
    "password": "your_secure_password",
    "name": "Admin"
  }'

# You should see:
# {"success":true,"message":"Admin created successfully",...}
```

## Step 6: Start Frontend

Open another terminal:

```bash
npm run dev

# You should see:
# VITE v5.x.x ready in xxx ms
# ➜ Local:   http://localhost:5173/
```

## Step 7: Test Everything

### Test Public Pages
1. Open http://localhost:5173
2. Browse properties
3. Click property to see details
4. Test WhatsApp & Call buttons

### Test Admin
1. Go to http://localhost:5173/admin
2. Login with:
   - Email: admin@kuldevta.com
   - Password: your_secure_password
3. Try adding a property
4. Upload images
5. Test featured toggle
6. Test advertisements

### Test Lead Capture
1. Open any property
2. Click on image
3. Fill lead form
4. Check in admin panel

## 🎉 You're Done!

## 🔒 Security Reminder

- Never commit real credentials to GitHub.
- Keep your `.env` files private.
- Rotate secrets immediately if credentials were exposed.


Your Kuldevta Estate Agency is now running!

### What's Next?

- [Read Full Documentation](./README.md)
- [Deploy to Production](./DEPLOYMENT.md)
- [API Reference](./API.md)

### Quick Commands

```bash
# Start backend (in server directory)
npm start              # Production
npm run dev            # Development with auto-reload

# Start frontend (in root directory)
npm run dev            # Development server
npm run build          # Build for production
npm run preview        # Preview production build
```

### Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Verify all environment variables are set
- Check port 5000 is not in use

**Frontend won't connect:**
- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for errors

**Can't upload images:**
- Verify Cloudinary credentials
- Check file size is under 50MB
- Ensure file format is supported

### Default Contact Info

The app uses these hardcoded contact details:
- Phone: 9930388219
- WhatsApp: 9930388219

To change, update:
- Frontend: `src/components/ContactButtons.jsx`
- Backend: Can be added to property contact field

### Admin Features

Once logged in as admin, you can:
- ✅ Add/Edit/Delete properties
- ✅ Upload up to 20 images per property
- ✅ Upload up to 5 videos per property
- ✅ Mark properties as Featured
- ✅ Set Advertisement dates
- ✅ Hide/Show properties
- ✅ View all leads
- ✅ Track property views
- ✅ Manage lead status

### Need Help?

- WhatsApp: +91 9930388219
- Email: admin@kuldevta.com

---

**Happy Building! 🏗️**
