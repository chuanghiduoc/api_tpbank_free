const express = require('express');
const TPBankClient = require('../services/TPBankClient');
const { validateCredentials } = require('../middleware/validation');

const router = express.Router();

// Cache for TPBankClient instances with TTL (keyed by username+deviceId)
const clientCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 100;

/**
 * Clean expired entries from cache
 */
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of clientCache.entries()) {
    if (now > entry.expiresAt) {
      clientCache.delete(key);
    }
  }
}

/**
 * Get or create a TPBankClient for the given credentials
 * @param {Object} credentials - User credentials
 * @returns {TPBankClient} Client instance
 */
function getClient(credentials) {
  // Clean expired entries periodically
  if (clientCache.size > MAX_CACHE_SIZE / 2) {
    cleanExpiredCache();
  }

  // Evict oldest if still over limit
  if (clientCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = clientCache.keys().next().value;
    clientCache.delete(oldestKey);
  }

  const cacheKey = `${credentials.username}:${credentials.deviceId}`;
  const cached = clientCache.get(cacheKey);
  const now = Date.now();

  if (cached && now < cached.expiresAt) {
    // Update credentials in case they changed
    cached.client.password = credentials.password;
    cached.client.accountId = credentials.accountId;
    cached.expiresAt = now + CACHE_TTL_MS;
    return cached.client;
  }

  const client = new TPBankClient(credentials);
  clientCache.set(cacheKey, {
    client,
    expiresAt: now + CACHE_TTL_MS,
  });

  return client;
}

/**
 * POST /histories
 * Get transaction history from TPBank
 */
router.post('/', validateCredentials, async (req, res, next) => {
  try {
    const client = getClient(req.credentials);
    const histories = await client.getTransactionHistory();

    res.json({ info: histories });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /histories/search
 * Get transaction history with custom options
 */
router.post('/search', validateCredentials, async (req, res, next) => {
  try {
    const { days, pageNumber, pageSize, keyword } = req.body;

    // Validate and sanitize search parameters
    const validatedOptions = {};

    if (days !== undefined) {
      const daysNum = parseInt(days, 10);
      if (isNaN(daysNum) || daysNum < 1 || daysNum > 365) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'days must be a number between 1 and 365',
        });
      }
      validatedOptions.days = daysNum;
    }

    if (pageNumber !== undefined) {
      const pageNum = parseInt(pageNumber, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'pageNumber must be a positive integer',
        });
      }
      validatedOptions.pageNumber = pageNum;
    }

    if (pageSize !== undefined) {
      const size = parseInt(pageSize, 10);
      if (isNaN(size) || size < 1 || size > 1000) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'pageSize must be between 1 and 1000',
        });
      }
      validatedOptions.pageSize = size;
    }

    if (keyword !== undefined) {
      if (typeof keyword !== 'string' || keyword.length > 100) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'keyword must be a string with max 100 characters',
        });
      }
      validatedOptions.keyword = keyword.trim();
    }

    const client = getClient(req.credentials);
    const histories = await client.getTransactionHistory(validatedOptions);

    res.json({ info: histories });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
