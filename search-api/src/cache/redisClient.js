const Redis = require('ioredis');

const host = process.env.REDIS_HOST || 'redis';
const port = process.env.REDIS_PORT || 6379;

const redis = new Redis({
  host,
  port: Number(port),
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis Search Cache');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

module.exports = redis;