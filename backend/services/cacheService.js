const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || `redis://:${process.env.REDIS_PASSWORD || 'redis123'}@${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`;
      
      this.client = redis.createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('Redis: Too many reconnection attempts, giving up');
              return new Error('Too many reconnection attempts');
            }
            console.log(`Redis: Reconnection attempt ${retries}`);
            return Math.min(retries * 100, 3000);
          },
          connectTimeout: 10000,
          lazyConnect: true
        }
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        console.log('🔌 Redis connection ended');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error.message);
      this.isConnected = false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Get value from cache
  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set value in cache with TTL (time to live in seconds)
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete key from cache
  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key) {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set expiration for existing key
  async expire(key, ttl) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  // Get multiple keys
  async mget(keys) {
    if (!this.isConnected) return [];
    
    try {
      const values = await this.client.mGet(keys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return [];
    }
  }

  // Increment counter
  async incr(key) {
    if (!this.isConnected) return 0;
    
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  // Cache products with category-based invalidation
  async cacheProducts(products, category = 'all') {
    const key = `products:${category}`;
    return await this.set(key, products, 1800); // 30 minutes
  }

  // Get cached products
  async getCachedProducts(category = 'all') {
    const key = `products:${category}`;
    return await this.get(key);
  }

  // Cache user session
  async cacheUserSession(userId, sessionData) {
    const key = `session:${userId}`;
    return await this.set(key, sessionData, 86400); // 24 hours
  }

  // Get cached user session
  async getCachedUserSession(userId) {
    const key = `session:${userId}`;
    return await this.get(key);
  }

  // Cache shopping cart
  async cacheCart(userId, cartData) {
    const key = `cart:${userId}`;
    return await this.set(key, cartData, 604800); // 7 days
  }

  // Get cached cart
  async getCachedCart(userId) {
    const key = `cart:${userId}`;
    return await this.get(key);
  }

  // Clear all cache (use with caution)
  async flushAll() {
    if (!this.isConnected) return false;
    
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new CacheService();