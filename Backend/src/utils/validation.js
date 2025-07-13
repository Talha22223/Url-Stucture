import { ValidationError } from './errorHandler.js';

export const validateUrl = (url) => {
    if (!url) {
        throw new ValidationError('URL is required');
    }

    if (typeof url !== 'string') {
        throw new ValidationError('URL must be a string');
    }

    if (url.length > 2048) {
        throw new ValidationError('URL must be less than 2048 characters');
    }

    // Enhanced URL validation
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
        throw new ValidationError('Invalid URL format. URL must start with http://, https://, or ftp://');
    }

    // Check for malicious patterns
    const maliciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i
    ];

    for (const pattern of maliciousPatterns) {
        if (pattern.test(url)) {
            throw new ValidationError('URL contains potentially malicious content');
        }
    }

    return true;
};

export const sanitizeUrl = (url) => {
    if (!url) return url;
    
    // Remove any leading/trailing whitespace
    url = url.trim();
    
    // Ensure protocol is included
    if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
    }
    
    return url;
};

export const validateShortUrlId = (id) => {
    if (!id) {
        throw new ValidationError('Short URL ID is required');
    }

    if (typeof id !== 'string') {
        throw new ValidationError('Short URL ID must be a string');
    }

    if (id.length < 3 || id.length > 20) {
        throw new ValidationError('Short URL ID must be between 3 and 20 characters');
    }

    // Check for valid characters (alphanumeric, dash, underscore)
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(id)) {
        throw new ValidationError('Short URL ID contains invalid characters');
    }

    return true;
};
