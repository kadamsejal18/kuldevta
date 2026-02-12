# 🚀 Deployment Guide

Complete step-by-step guide to deploy Kuldevta Estate Agency SaaS.

## Prerequisites Checklist

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ MongoDB Atlas account (free tier available)
- ✅ Cloudinary account (free tier available)
- ✅ Render account (for backend)
- ✅ Vercel account (for frontend)

---

## Part 1: MongoDB Setup

### 1. Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new cluster (Free M0 tier is sufficient)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `kuldevta`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kuldevta?retryWrites=true&w=majority`

### 2. Whitelist IP Addresses

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Render)
4. Click "Confirm"

---

## Part 2: Cloudinary Setup

### 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy these credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Create Upload Folders

1. In Cloudinary Dashboard, go to "Media Library"
2. Create folders:
   - `kuldevta/properties` (for property images)
   - `kuldevta/videos` (for property videos)

---

## Part 3: Backend Deployment (Render)

### 1. Prepare Repository

1. Push your code to GitHub
2. Make sure `.env` is in `.gitignore`
3. Commit and push all changes

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:

```
Name: kuldevta-backend
Environment: Node
Region: Choose closest to your users
Branch: main (or master)
Root Directory: server
Build Command: npm install
Start Command: node server.js
```

### 3. Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@kuldevta.com
ADMIN_PASSWORD=your_secure_admin_password
FRONTEND_URL=https://kuldevta.vercel.app
```

**Important:** 
- Use a strong, random JWT_SECRET (at least 32 characters)
- Use a strong ADMIN_PASSWORD
- Update FRONTEND_URL after deploying frontend

### 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://kuldevta-backend.onrender.com`)

### 5. Create Admin Account

After deployment, create admin using one of these methods:

**Method 1: Using curl**
```bash
curl -X POST https://kuldevta-backend.onrender.com/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kuldevta.com",
    "password": "your_secure_password",
    "name": "Admin"
  }'
```

**Method 2: Using Postman**
- Method: POST
- URL: `https://kuldevta-backend.onrender.com/api/auth/create-admin`
- Body (JSON):
```json
{
  "email": "admin@kuldevta.com",
  "password": "your_secure_password",
  "name": "Admin"
}
```

**Method 3: Using Browser Console**
```javascript
fetch('https://kuldevta-backend.onrender.com/api/auth/create-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@kuldevta.com',
    password: 'your_secure_password',
    name: 'Admin'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## Part 4: Frontend Deployment (Vercel)

### 1. Update Environment Variable

Create `.env` in root directory:

```
VITE_API_URL=https://kuldevta-backend.onrender.com/api
```

Commit this change to GitHub.

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: ./
```

### 3. Add Environment Variables

In Vercel project settings:

```
Name: VITE_API_URL
Value: https://kuldevta-backend.onrender.com/api
```

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Copy your frontend URL (e.g., `https://kuldevta.vercel.app`)

### 5. Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Update environment variable:
```
FRONTEND_URL=https://kuldevta.vercel.app
```
4. Save and wait for redeploy

---

## Part 5: Testing Deployment

### 1. Test Public Pages

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Properties page loads
- ✅ Property details page loads
- ✅ Contact buttons work (WhatsApp & Call)
- ✅ Search and filters work

### 2. Test Admin Login

1. Go to `https://kuldevta.vercel.app/admin`
2. Login with admin credentials
3. Verify you can:
   - ✅ View admin dashboard
   - ✅ Add new property
   - ✅ Upload images
   - ✅ Upload videos
   - ✅ Mark as featured
   - ✅ Set advertisements
   - ✅ View leads

### 3. Test Lead Capture

1. Open any property
2. Click on image gallery
3. Fill lead form
4. Verify lead appears in admin panel

---

## Part 6: Custom Domain (Optional)

### Frontend Custom Domain

1. In Vercel project settings → "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `kuldevta.com`)
4. Follow DNS configuration instructions
5. Update backend FRONTEND_URL environment variable

### Backend Custom Domain

1. In Render service settings → "Custom Domain"
2. Add your domain (e.g., `api.kuldevta.com`)
3. Follow DNS configuration instructions
4. Update frontend VITE_API_URL

---

## Troubleshooting

### Backend Issues

**Problem: "Cannot connect to database"**
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Check MongoDB user permissions

**Problem: "Admin already exists"**
- Admin can only be created once
- If you need to reset, delete admin from MongoDB

**Problem: "CORS error"**
- Verify FRONTEND_URL in backend matches Vercel URL exactly
- Include https:// in URL
- Redeploy backend after changing FRONTEND_URL

### Frontend Issues

**Problem: "Network Error"**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for exact error

**Problem: "Images not uploading"**
- Verify Cloudinary credentials
- Check Cloudinary folders exist
- Verify file size under 50MB

### Deployment Issues

**Problem: "Build failed on Render"**
- Check Build Command is `npm install`
- Check Start Command is `node server.js`
- Verify all dependencies in package.json

**Problem: "Build failed on Vercel"**
- Check Build Command is `npm run build`
- Verify Output Directory is `dist`
- Check all dependencies installed

---

## Performance Optimization

### Backend

1. **Database Indexes**: Already configured in models
2. **Caching**: Consider adding Redis for frequently accessed data
3. **Rate Limiting**: Already configured (100 requests per 15 minutes)

### Frontend

1. **Image Optimization**: Use Cloudinary transformations
2. **Lazy Loading**: Implement for property lists
3. **Code Splitting**: Already handled by Vite

---

## Monitoring

### Backend Health Check

Visit: `https://kuldevta-backend.onrender.com/health`

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-10T..."
}
```

### Render Logs

1. Go to Render dashboard
2. Click on your service
3. View "Logs" tab for errors

### Vercel Logs

1. Go to Vercel dashboard
2. Click on your project
3. View deployments and logs

---

## Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ Strong admin password
- ✅ MongoDB IP whitelist configured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Environment variables not in repository
- ✅ HTTPS enabled (automatic on Render/Vercel)

---

## Backup Strategy

### Database Backup

1. MongoDB Atlas automatically backs up every 24 hours
2. To manual backup:
   - Go to MongoDB Atlas
   - Clusters → ... → "Export Data"

### Cloudinary Backup

1. Cloudinary automatically stores all media
2. Export media library if needed:
   - Media Library → Select All → Download

---

## Support & Maintenance

### Regular Tasks

- Monitor error logs weekly
- Check lead submissions daily
- Backup database monthly
- Update dependencies quarterly

### Cost Estimates

**Free Tier:**
- MongoDB Atlas: Free (512MB storage)
- Cloudinary: Free (25 GB storage, 25 GB bandwidth)
- Render: Free (750 hours/month)
- Vercel: Free (100 GB bandwidth)

**Paid Tier (If Needed):**
- MongoDB Atlas: $57/month (2GB)
- Cloudinary: $89/month (100GB)
- Render: $7/month per service
- Vercel: $20/month (1TB bandwidth)

---

## Contact

For deployment support:
- WhatsApp: +91 9930388219
- Email: admin@kuldevta.com

---

**Congratulations! Your Kuldevta Estate Agency SaaS is now live! 🎉**
