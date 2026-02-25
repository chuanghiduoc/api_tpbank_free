/**
 * Custom error classes for better error handling
 */

class TPBankError extends Error {
  constructor(message, statusCode = 500, originalError = null) {
    super(message);
    this.name = 'TPBankError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

class AuthenticationError extends TPBankError {
  constructor(message = 'Authentication failed', originalError = null) {
    super(message, 401, originalError);
    this.name = 'AuthenticationError';
  }
}

class TokenExpiredError extends TPBankError {
  constructor(message = 'Token expired') {
    super(message, 401);
    this.name = 'TokenExpiredError';
  }
}

module.exports = {
  TPBankError,
  AuthenticationError,
  TokenExpiredError,
};
