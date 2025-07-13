import { getShortUrl } from "../dao/short_url.js";
import { createShortUrlServiceWithoutUser, createShortUrlServiceWithUser } from "../services/short_url.service.js";

export const createdShortUrl = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        let shortUrl;
        if (req.userId) {
            // User is authenticated
            shortUrl = await createShortUrlServiceWithUser(url, req.userId);
        } else {
            // Anonymous user
            shortUrl = await createShortUrlServiceWithoutUser(url);
        }
        
        const baseUrl = process.env.APP_URL || 'http://localhost:5000';
        res.json({ shortUrl: `${baseUrl}/${shortUrl}` });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Failed to create short URL' });
    }
};

export const redirectShortUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await getShortUrl(id);
        
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error redirecting URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
