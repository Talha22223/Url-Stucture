// In-memory storage for URL shortening (temporary solution)
const urlDatabase = new Map();

export const saveUrlToMemory = (shortId, fullUrl, user = null) => {
    const urlData = {
        short_url: shortId,
        full_url: fullUrl,
        user: user,
        clicks: 0,
        createdAt: new Date()
    };
    urlDatabase.set(shortId, urlData);
    return urlData;
};

export const getUrlFromMemory = (shortId) => {
    const urlData = urlDatabase.get(shortId);
    if (urlData) {
        urlData.clicks++;
        return urlData.full_url;
    }
    return null;
};

export const getAllUrlsFromMemory = () => {
    return Array.from(urlDatabase.values());
};

console.log('In-memory storage initialized for URL shortening');
