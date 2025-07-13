import express from 'express';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/mongo.config.js';
import ShortUrl from './src/routes/shorturl.route.js';
import authRoutes from './src/routes/auth.routes.js';
import urlSchema from './src/models/shorturl.model.js';
import { redirectShortUrl } from './src/controller/shorturl.control.js';

dotenv.config("./.env");
const app = express();

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://your-app-name.vercel.app', // Add your Vercel domain
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/create', ShortUrl);
app.use('/api/auth', authRoutes);
app.get("/:id", redirectShortUrl);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Frontend should be running on: http://localhost:5175`);
        console.log(`API endpoint: http://localhost:${PORT}/api/create`);
    }
    
    // Try to connect to MongoDB, but don't crash if it fails
    connectDB().catch(err => {
        console.log("MongoDB connection failed - using in-memory storage");
        console.log("Note: URLs will be lost when server restarts");
    });
});
