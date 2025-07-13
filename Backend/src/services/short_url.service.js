import { generateNanoid } from "../utils/helper.js";
import urlSchema from '../models/shorturl.model.js';
import { saveShortUrl } from '../dao/short_url.js';
import { saveUrlToMemory } from '../storage/memory.js';

export const createShortUrlServiceWithoutUser = async (url) => {
    try {
        if (!url) {
            throw new Error('URL is required');
        }
        
        // Basic URL validation
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(url)) {
            throw new Error('Invalid URL format');
        }

        const shortUrl = generateNanoid(7);
        
        // Try to save to MongoDB, fallback to memory
        try {
            await saveShortUrl(shortUrl, url);
        } catch (dbError) {
            console.log('MongoDB unavailable, using memory storage');
            saveUrlToMemory(shortUrl, url);
        }
        
        return shortUrl;
    } catch (error) {
        console.error('Error in createShortUrlServiceWithoutUser:', error.message);
        throw error;
    }
}

export const createShortUrlServiceWithUser = async (url, userId) => {
    try {
        if (!url) {
            throw new Error('URL is required');
        }
        
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        // Basic URL validation
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(url)) {
            throw new Error('Invalid URL format');
        }

        const shortUrl = generateNanoid(7);
        
        // Try to save to MongoDB with user ID, fallback to memory
        try {
            const urlDocument = new urlSchema({
                shortUrl,
                url,
                user: userId
            });
            await urlDocument.save();
        } catch (dbError) {
            console.log('MongoDB unavailable, using memory storage for authenticated user');
            saveUrlToMemory(shortUrl, url, userId);
        }
        
        return shortUrl;
    } catch (error) {
        console.error('Error in createShortUrlServiceWithUser:', error.message);
        throw error;
    }
};