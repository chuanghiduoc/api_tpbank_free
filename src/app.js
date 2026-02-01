const express = require('express');
const cors = require('cors');
const historiesRouter = require('./routes/histories');
const { errorHandler } = require('./middleware/errorHandler');

/**
 * Create and configure Express application
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/histories', historiesRouter);

  // 404 handler (must be before error handler)
  app.use((req, res, next) => {
    res.status(404).json({
      error: 'NotFound',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
