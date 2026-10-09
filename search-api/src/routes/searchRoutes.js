const express = require('express');
const router = express.Router();
const redis = require('../cache/redisClient');
const { executeSearch } = require('../query/searchEngine');

const CACHE_TTL_SECONDS = 30; // Hot search cache window

router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  if (!query.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const cacheKey = `search:${query.trim().toLowerCase()}`;

  try {
    // 1. Check Redis Cache
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      const parsed = JSON.parse(cachedResult);
      return res.status(200).json({
        ...parsed,
        source: 'REDIS_CACHE'
      });
    }

    // 2. Cache Miss: Execute Disk Inverted Index Search
    const searchData = await executeSearch(query);

    const responsePayload = {
      query,
      totalHits: searchData.totalHits,
      scannedSegments: searchData.scannedSegments,
      results: searchData.results,
      source: 'DISK_SEGMENT_INDEX'
    };

    // 3. Populate Redis Cache
    await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(responsePayload));

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Search Route Error:', error.message);
    return res.status(500).json({ error: 'Failed to process search query' });
  }
});

module.exports = router;