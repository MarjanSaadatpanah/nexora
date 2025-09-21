// utils/chartCache.js
class ChartCache {
    constructor() {
        this.cache = new Map();
        this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000); // Clean up every minute
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        // Check if item is still valid (5 minute expiry)
        if (Date.now() - item.timestamp > 5 * 60 * 1000) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > 5 * 60 * 1000) {
                this.cache.delete(key);
            }
        }
    }

    clear() {
        this.cache.clear();
    }

    // Get all cache keys (useful for debugging)
    getKeys() {
        return Array.from(this.cache.keys());
    }
}

// Export a singleton instance
const chartCache = new ChartCache();
export default chartCache;