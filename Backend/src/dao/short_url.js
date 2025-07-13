import urlSchema from "../models/shorturl.model.js";
import { getUrlFromMemory } from "../storage/memory.js";

export const saveShortUrl = async (shorturl, longurl, userid) => {
    try {
        if (!shorturl || !longurl) {
            throw new Error('Short URL and long URL are required');
        }

        // Check if short URL already exists
        const existingUrl = await urlSchema.findOne({ short_url: shorturl });
        if (existingUrl) {
            throw new Error('Short URL already exists');
        }

        const newUrl = new urlSchema({
            full_url: longurl,
            short_url: shorturl
        });
        
        if (userid) {
            newUrl.user = userid; // Assign user ID if provided
        }
        
        const savedUrl = await newUrl.save();
        return savedUrl;
    } catch (error) {
        console.error('Error in saveShortUrl:', error.message);
        throw error;
    }
}

export const getShortUrl = async (shorturl) => {
    try {
        if (!shorturl) {
            throw new Error('Short URL is required');
        }

        // Try MongoDB first
        try {
            const urlDoc = await urlSchema.findOneAndUpdate(
                { short_url: shorturl },
                { $inc: { clicks: 1 } },
                { new: true }
            );
            
            if (urlDoc) {
                return urlDoc.full_url;
            }
        } catch (dbError) {
            console.log('MongoDB unavailable, checking memory storage');
        }

        // Fallback to memory storage
        const url = getUrlFromMemory(shorturl);
        if (!url) {
            return null;
        }
        
        return url;
    } catch (error) {
        console.error('Error in getShortUrl:', error.message);
        throw error;
    }
}
