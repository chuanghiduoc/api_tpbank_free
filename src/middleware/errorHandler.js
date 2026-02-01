const { TPBankError } = require('../utils/errors');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging (but not sensitive data)
  console.error(`[${new Date().toISOString()}] Error:`, err.name, '-', err.message);

  // Handle known errors
  if (err instanceof TPBankError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...(err.fields && { fields: err.fields }),
    });
  }

  // Handle axios errors
  if (err.response) {
    return res.status(err.response.status).json({
      error: 'APIError',
      message: err.response.data?.message || err.message,
    });
  }

  // Handle unknown errors
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}

module.exports = { errorHandler };
