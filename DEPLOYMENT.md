# 🚀 URL Shortener - Vercel Deployment Guide

## Quick Deployment Steps:

### 1. Push to GitHub
```bash
# If you haven't already, create a GitHub repository
# Push your code to GitHub
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration

### 3. Set Environment Variables in Vercel Dashboard:
- `JWT_SECRET`: your-super-secret-jwt-key-here
- `MONGODB_URI`: mongodb+srv://username:password@cluster.mongodb.net/urlshortener
- `NODE_ENV`: production
- `VITE_API_URL`: https://your-app-name.vercel.app

### 4. Your App Structure:
```
url-shortener/
├── Frontend/          # React frontend
├── Backend/           # Node.js API
├── vercel.json        # Deployment config
└── package.json       # Root config
```

### 5. Live URLs:
- **Frontend**: https://your-app-name.vercel.app
- **API**: https://your-app-name.vercel.app/api/*

## Features:
✅ Authentication (Login/Signup)
✅ Anonymous users (3 URL limit)
✅ Authenticated users (unlimited URLs)
✅ URL history for registered users
✅ Dark/Light theme toggle
✅ Professional UI with animations
✅ Mobile responsive
✅ Custom favicon
✅ MongoDB with fallback to in-memory storage

## Tech Stack:
- **Frontend**: React, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: Vercel
- **Authentication**: bcryptjs + JWT tokens
