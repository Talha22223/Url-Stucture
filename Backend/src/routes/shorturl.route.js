import express from 'express';
import { createdShortUrl } from '../controller/shorturl.control.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Simple POST route for creating short URLs (supports both authenticated and anonymous users)
router.post("/", optionalAuth, createdShortUrl);

export default router;